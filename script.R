

# ustawcie katalog roboczy na folder z plikami
# zainstalujcie pakiety sf, tmap i raster
library(sf)
library(tmap)
library(raster)

kawiarnie <- st_read("dane/kawiarnie.gpkg")
parki <- st_read("dane/parki.gpkg")
poznan <- raster("dane/poznan_temperatura.tif")

tmap_mode("view")
tm_shape(kawiarnie) + tm_dots(col = "#222222", size = 0.1) +
  tm_shape(parki) + tm_polygons(col = "darkgreen") +
  tm_shape(poznan) + tm_raster(palette = "-RdYlGn")
