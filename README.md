# Changes done by Saswat on 2nd January 2022

Here are a few major changes I did to improve the backend today.

- Created a new email route for posting email to a client whenever someone registers for a course. Also added a meaningful, energetic and clickable content so that the user will remember that he has a course he needs to complete within a particular time.
- Improved the efficiency of almost all routes that have been added till now. Database queries can be 10x faster, providing a seamless user experience if our servers are expanded.
- Made the code more secure by validating object id's before quering the db.
- Added meaningfull comments wherever necessary.
- Fixed some bugs.

## Things That I am planning to do

- Use caching and graphql to only serve the data we want.
- Add routes according to what you want.

## Some suggestions: 
- For example there could be a route on the frontend side where only a particular data is required. But we have to serve the entire data making the servers slow. Using graphql or caching can be a really great way of enhancing speed.
- Creating and trying to complete the primary pages of site.
- Increasing the speed of the website (making it load faster eg. by using lazy loding of imgs and a combination of view engines and frontend frameworks big companies prefer this pattern)
