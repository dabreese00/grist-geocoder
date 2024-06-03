# Geocoder widget for Grist

How it works:

0. Create a Grist table with columns for Address, Latitude, Longitude.
1. Create a custom widget in your Grist document.
2. Point it to the URL where you have this `index.html` hosted.
3. Grant it full permission to your document.
4. Click "Configure options" and enter your Google Maps API key as Option 1.
5. Every time you click on a row/record in the table, the widget will overwrite the Latitude and Longitude fields for that record, with the results of geocoding that record's Address.
6. When you're done, remove the custom widget to stop making Google Maps API requests every time you click a record.

You can use the Latitudes and Longitudes to get a map using the pre-made custom Map widget.  That widget is supposed to have its own built-in geocoder with similar functionality, but for me I couldn't get it to work.  So I built this stand-alone one as an experiment and to learn about how all this stuff works.

To-do:

- Troubleshoot geocoding robustness: Seems to be giving some duplicate lat/long values, maybe due to fictional addresses?
- Find a way to securely store an API key so the user doesn't need one.
- Choose a better trigger for it to update the geocoding, instead of "on click" record by record.
