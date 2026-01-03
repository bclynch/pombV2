#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting development environment...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Error: Docker is not running. Please start Docker Desktop first.${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"

# Check if Supabase containers are already running
if docker ps --format '{{.Names}}' | grep -q 'supabase_kong_pomb'; then
  echo -e "${GREEN}✓ Supabase is already running${NC}"
else
  echo -e "${YELLOW}Starting Supabase...${NC}"
  npx supabase start

  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to start Supabase${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ Supabase started${NC}"
fi

# Wait for Supabase to be healthy
echo -e "${YELLOW}Waiting for Supabase services to be healthy...${NC}"
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  # Check if kong (API gateway) is healthy
  if docker ps --format '{{.Names}} {{.Status}}' | grep 'supabase_kong_pomb' | grep -q 'healthy'; then
    echo -e "${GREEN}✓ Supabase API gateway is healthy${NC}"
    break
  fi

  ATTEMPT=$((ATTEMPT + 1))
  if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo -e "${RED}Error: Supabase did not become healthy in time${NC}"
    exit 1
  fi

  echo "  Waiting for services... (attempt $ATTEMPT/$MAX_ATTEMPTS)"
  sleep 2
done

# Check if edge functions are already running
if lsof -i :54321 -sTCP:LISTEN 2>/dev/null | grep -q 'supabase'; then
  # Edge functions might be served via the same port through kong
  # Let's check if edge runtime container exists or if functions serve is running
  if pgrep -f "supabase functions serve" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Edge functions are already running${NC}"
  else
    echo -e "${YELLOW}Starting edge functions...${NC}"
    npx supabase functions serve &
    EDGE_PID=$!
    sleep 3

    if kill -0 $EDGE_PID 2>/dev/null; then
      echo -e "${GREEN}✓ Edge functions started (PID: $EDGE_PID)${NC}"
    else
      echo -e "${RED}Warning: Edge functions may have failed to start${NC}"
    fi
  fi
else
  echo -e "${YELLOW}Starting edge functions...${NC}"
  npx supabase functions serve &
  EDGE_PID=$!
  sleep 3

  if kill -0 $EDGE_PID 2>/dev/null; then
    echo -e "${GREEN}✓ Edge functions started (PID: $EDGE_PID)${NC}"
  else
    echo -e "${RED}Warning: Edge functions may have failed to start${NC}"
  fi
fi

echo ""
echo -e "${GREEN}Development environment is ready!${NC}"
echo ""
echo "Services available at:"
echo "  - API:        http://127.0.0.1:54321"
echo "  - GraphQL:    http://127.0.0.1:54321/graphql/v1"
echo "  - Studio:     http://127.0.0.1:54323"
echo "  - Functions:  http://127.0.0.1:54321/functions/v1/"
echo ""
