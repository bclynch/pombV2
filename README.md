# POMB

## Scripts

Run iOS app + watched relay compiler:

`npm run dev:mobile`

Run web app + watched relay compiler:

`npm run dev:web`


## TODO

- Trip screen
  - Thinking about how trip segments are modeled:
    - Each segment is one part of a user's trip carousel with corresponding card
    - Each segment can be a single point if manually created (say a point at GGB) or a gpx line
      - Would need some kind of pin drop or even better a search function for places -- but would want to make sure is free
      - If gpx would be great to provide stats (distance, elevation gained, etc)
      - Can consolidate multiple segments into one
    - Can be multiple segments in a day (GGB, Marina, Mission) or multiple days per segment (SF, SJ, Santa Cruz)
    - Each segment can have a name, pics, etc
  - Might be nice to have another modal pop up or something after segment creation to upload pics, update name, etc in one fell swoop
  - Carousel of segments with pics
  - Zoom to portion of map on focus
  - ig style story pics for a segment
  - Ability to like or comment on a segment or photo or post
  - Ability to add a (written) post to a trip
- Ability to follow users, get notifs when they update something 
- Tagging a user in a photo
- Videos 
- Stories style UX on home screen for people you follow
- Functionality for mobile app to track you with gps and create gpx  
- Deploy to cloudflare pages
  - Wire up deploy on commit
- Deploy to google play store   
- Add domain for maptiler API key once it's deployed
- Add domain for R2 bucket CORS once deployed

## Done

- Create monorepo
- Create Supabase integration
- Initial schema
- Add Relay consumption
- Add maps to both apps
- Add CDS to both apps
- Add signup/sign in
- Create cloudflare r2 bucket
- Upload gpx functionality
- Update db geojson stuff
- Profile route
- Create trip UX
- Refactor for better CDS usage
- Upload pics for a trip
  - attaching to gpx somehow 
- Concept of segments on gpx upload or manual  
- Only types not interfaces
- Carousel pic viewer
