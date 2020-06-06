# Notes on the stops data
* This data was hand-collected by kohzy while reading Ha Jin's book. Certain locations mentioned in the book may have been excluded from the list due to the location being less significant to Li Bai's story.
* This data only documents the stops that Li Bai took - it does not capture the specific *route* that Li Bai may have taken between the stops, even though Ha Jin may have described it in the book.

---

## Tools
* This data follows the [GeoJSON spec](https://geojson.org/) for encoding geographic information
* Tom MacWright has written a highly readable overview of the GeoJSON spec [here](https://macwright.org/2015/03/23/geojson-second-bite.html#features)
* I found the following tools useful to compile and validate the GeoJSON data:
1. [geojson.io tool for collating maps](https://geojson.io/)
2. [VSCode map preview extension](https://github.com/jumpinjackie/vscode-map-preview)

---

## Data Spec
The specific `coordinates` in the GeoJSON data:
* The long lat data was collected primarily from Wikipedia ([e.g. Suyab](https://tools.wmflabs.org/geohack/geohack.php?pagename=Suyab&params=42_48_18.8_N_75_11_59.6_E_type:landmark)), in [Decimal Degrees](https://en.wikipedia.org/wiki/Decimal_degrees)

The following custom `properties` are included in the GeoJSON data:
* `historic-name`: This documents the historic name of the location, during the time of Li Bai. I mostly use the name presented by Ha Jin in the book.
* `modern-name`: This documents the present name of the location. I mostly defer to the name noted by Ha Jin in the book. Where the author does not include a modern-day name of the location, I found a modern location name from Google Maps.
* `year`: This refers to the year when Li Bai stops at this particular location. Where a specific year is not noted by Ha Jin, I include the likely range. All years in AD.
* `book-page`: This refers to the page where the location of Li Bai's stop is first noted. It corresponds to a page in the 2019 paperback copy of Ha Jin's book. I am not certain how it lines up to other editions of this book (e.g. Kindle or hardcover)
* `companion`: This documents notable figures who were with Li Bai at a particular stop. There are other figures described who Li Bai interacted with, but I chose to only include figures who had a significant impact on Li Bai's journey.