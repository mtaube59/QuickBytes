# Outline of proposed code flow

## Default use case : Automatic device location determination works.
1. Page loads with empty table, form and map.
2. Automatically obtain device location (IP Location API?)
3. Use the location to fill in the form fields.
4. Write lat and lon into attributes of the form (keep hidden from user, but put in DOM so that javascript can retrieve it).
5. Javascript to get lat lon values from hidden attributes and use them in AJAX calls to the Zomato API.
6. Once Zomato returns a restaurant listing, use AJAX calls to the Mapquest API to get driving time and walking time to each.
7. Once all driving time and walking time are obtain, run Javascript call to populate table.
8. Pass same data to the map in TBD way.
