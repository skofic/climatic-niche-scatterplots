// The Dataset records this project registers in GeoService.Dataset, in the `std_dataset` target shape
// (metadata-store, 2026-10-24): top-level std_dataset_code / dates / count / _info, std_dataset_domn,
// std_dataset_prop. Inserted WITHOUT a key (the collection assigns a short one); looked up by code.
// Usage: node sources/datasets/records.js [--write]   (without --write: validate and show what would be inserted)
import { connect, loadCredentials, explain } from '../../lib/db.js'
import { loadDictionary, validator } from '../../lib/dictionary.js'
import { GID } from '../../config/indicators.js'

const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
const eng = (s) => ({ ISO_639_3_eng: s })

// Citations of the climate sources our own collections are derived from, as their Dataset records carry them
// (WORLDCLIM_V2.1 and CHELSA_V2.1, written by metadata-external-databases); first citation of each.
const CITE = {
  euforest: 'Mauri, A., Strona, G., San-Miguel-Ayanz, J. (2017). EU-Forest, a high-resolution tree occurrence dataset for Europe. *Scientific Data* 4:160123. doi: [10.1038/sdata.2016.123](https://doi.org/10.1038/sdata.2016.123)',
  eutrees4f: 'Mauri, A., Girardello, M., Strona, G., Beck, P.S.A., Forzieri, G., Caudullo, G., Manca, F., Cescatti, A. (2022). EU-Trees4F, a dataset on the future distribution of European tree species. *Scientific Data* 9:37. doi: [10.1038/s41597-022-01128-5](https://doi.org/10.1038/s41597-022-01128-5)',
  worldclim: 'Fick, S.E. and R.J. Hijmans, 2017. WorldClim 2: new 1km spatial resolution climate surfaces for global land areas. [International Journal of Climatology 37 (12): 4302-4315](https://rmets.onlinelibrary.wiley.com/doi/abs/10.1002/joc.5086).',
  chelsa: "Karger, D.N., Conrad, O., Böhner, J., Kawohl, T., Kreft, H., Soria-Auza, R.W., Zimmermann, N.E., Linder, H.P., Kessler, M. (2017): Climatologies at high resolution for the Earth's land surface areas. *Scientific Data* 4:170122. [https://doi.org/10.1038/sdata.2017.122](https://doi.org/10.1038/sdata.2017.122)",
}
const REPO_URL = '[climatic-niche-scatterplots on GitHub](https://github.com/skofic/climatic-niche-scatterplots)'

export const RECORDS = [
  {
    std_dataset_code: 'EU-FOREST_2017',
    std_date_submission: today, std_date_start: '2005', std_date_end: '2005',
    _info: {
      _title: eng("EU-Forest tree occurrences"),
      _definition: eng("Presence of tree species in forest plots across Europe, harmonised by the Joint Research Centre from national forest inventories and the Forest Focus and BioSoil surveys; forests of around 2005."),
      _description: eng("EU-Forest is a dataset of tree species occurrences across Europe, compiled by the Joint Research Centre from 21 National Forest Inventories and from the Forest Focus and BioSoil surveys. It records 588 983 occurrences of 242 species in 249 410 plots, each placed at the centre of a cell of the INSPIRE 1 km grid (ETRS89-LAEA, EPSG:3035).\n\nThe data record presence only: a plot lists the species that were found there. The survey years are not published; the inventories were gathered up to the 2008 framework contract of the Joint Research Centre and describe the forests of around 2005.\n\nHere the occurrences are the ground of the climatic niche scatterplots: all surveyed cells form the base layer, and the cells where a species was found form the layer of that species. They are stored, with the climate of each cell, in the [occurrence cells](dataset:SCATTER_OCCURRENCES)."),
      _references: {
        _citation: ['Mauri, A., Strona, G., San-Miguel-Ayanz, J. (2017). EU-Forest, a high-resolution tree occurrence dataset for Europe. *Scientific Data* 4:160123. doi: [10.1038/sdata.2016.123](https://doi.org/10.1038/sdata.2016.123)'],
        _url: ['[EU-Forest on figshare (CC0)](https://doi.org/10.6084/m9.figshare.c.3288407)'],
      },
    },
    std_dataset_domn: { std_dataset_extent: 'std_dataset_extent_region', std_dataset_scope: 'std_dataset_scope_grid', std_dataset_theme: 'std_dataset_theme_occurrences' },
    std_dataset_prop: { std_dataset_resolution_source: 1000, _collection_list: ['ScatterOccurrences'], std_terms: ['species_list', 'geometry_point'], std_terms_key: ['geometry_point'] },
  },
  {
    std_dataset_code: 'EU-TREES4F_PREDICTORS_2022',
    std_date_submission: today, std_date_start: '1961', std_date_end: '2080',
    _info: {
      _title: eng("EU-Trees4F climate predictors"),
      _definition: eng("Temperature, precipitation and continentality variables behind the EU-Trees4F species distribution models: WorldClim 1.4 for the 1961–1990 baseline, and EURO-CORDEX regional climate projections for three periods to 2080 under RCP 4.5 and RCP 8.5."),
      _description: eng("The seven climate layers with which the EU-Trees4F study calibrated and projected its species distribution models: mean annual temperature, annual precipitation, precipitation seasonality, summer temperature, summer precipitation, winter precipitation and continentality, on a grid of 5 arc-minutes (about 10 km) in WGS84.\n\nThe historical layers are WorldClim 1.4 for 1961–1990. The future layers are the mean of eleven EURO-CORDEX regional climate models, brought onto the same baseline by the change-factor method, for 1991–2020, 2021–2050 and 2051–2080 under the RCP 4.5 and RCP 8.5 scenarios. This is the exact climate behind the [EU-Trees4F distribution maps](dataset:EU-TREES4F_MAPS_2022).\n\n**What is taken from the study.** All seven variables, all periods and both scenarios, with the future as the mean of the eleven models. The study also publishes the future layers of each single model; those are not kept here.\n\nHere it is the climate the scatterplots show first, the climate as the study modelled it. Its values are read at every [occurrence cell](dataset:SCATTER_OCCURRENCES) and at every [gene conservation unit](dataset:SCATTER_UNITS). The same indicators from two sources at 1 km, [WorldClim 2.1](dataset:WORLDCLIM_V2.1) and [CHELSA 2.1](dataset:CHELSA_V2.1), can be selected in its place."),
      _methods: eng("The published layers store temperatures multiplied by ten and seasonal precipitation as the total of three months. The values kept here are in physical units: temperatures divided by ten, and seasonal totals divided by three to give the mean monthly amount."),
      _references: {
        _citation: ['Mauri, A., Girardello, M., Strona, G., Beck, P.S.A., Forzieri, G., Caudullo, G., Manca, F., Cescatti, A. (2022). EU-Trees4F, a dataset on the future distribution of European tree species. *Scientific Data* 9:37. doi: [10.1038/s41597-022-01128-5](https://doi.org/10.1038/s41597-022-01128-5)'],
        _url: ['[EU-Trees4F on figshare (CC0)](https://doi.org/10.6084/m9.figshare.c.5525688)'],
      },
    },
    std_dataset_domn: { std_dataset_extent: 'std_dataset_extent_region', std_dataset_scope: 'std_dataset_scope_grid', std_dataset_theme: 'std_dataset_theme_climate' },
    // resolution rules of 2026-11-18 (metadata-store 9f99093): the source resolution in metres as the provider states it
    // ("5 arc-minutes (~10 km)", Mauri et al. 2022), the stored grid in degrees written to ten decimals
    std_dataset_prop: { std_dataset_resolution_source: 10000, std_dataset_resolution_grid: 0.0833333333, _collection_list: ['ScatterOccurrences'], std_terms: [GID.bio01, GID.bio12, GID.bio15, GID.tas_summer, GID.pr_summer, GID.pr_winter, GID.continentality], std_terms_key: ['geometry_point'] },
  },
]

/** Every GID the Dataset records refer to, so the dictionary snapshot can validate them (term keys included). */
export function datasetGids() {
  const g = new Set(['std_dataset'])
  for (const r of RECORDS) for (const k of ['std_terms', 'std_terms_key']) for (const t of r.std_dataset_prop?.[k] ?? []) g.add(t)
  return [...g]
}

/**
 * Insert the records that do not exist yet (looked up by code) and return { code: _key }.
 * `missing` = GIDs the dictionary does not know yet (the requested derived terms): they are removed from the
 * record's std_terms before validation and insertion, and the record is completed when the terms land
 * (re-run with --update once they exist).
 */
RECORDS.push(
  {
    std_dataset_code: 'EU-TREES4F_MAPS_2022',
    std_date_submission: today, std_date_start: '2005', std_date_end: '2095',
    _info: {
      _title: eng("EU-Trees4F species distribution maps"),
      _definition: eng("Climatic suitability of European tree species from the EU-Trees4F ensemble of species distribution models, for the period centred on 2005 and for three future periods to 2095 under RCP 4.5 and RCP 8.5."),
      _description: eng("The modelled distribution of 67 European tree species from the EU-Trees4F study. An ensemble of species distribution models, calibrated and projected with the [EU-Trees4F climate predictors](dataset:EU-TREES4F_PREDICTORS_2022), gives the climatic suitability of every cell for each species in the current period (centred on 2005) and in three future periods (centred on 2035, 2065 and 2095) under the RCP 4.5 and RCP 8.5 scenarios.\n\nSuitability is published as a probability (0 to 1000) at 5 arc-minutes in WGS84, for the potential distribution: wherever the climate suits the species. It is also published as binary presence on the 10 km INSPIRE grid (ETRS89-LAEA): the potential distribution for every period; for the current period, the distribution realised within the native range; for the future periods, the distribution the species can reach by natural dispersal, and both future distributions clipped to forest land use.\n\n**What is taken from the study.** All 67 species, all periods and both scenarios. The study projects its models in two ways: under each of eleven regional climate models, with the results averaged (the SDM ensemble), and once under the mean climate of the eleven (the climatic ensemble). Only the SDM ensemble is served here, as probability and as binary presence. Its standard deviation, the climatic ensemble and the maps of the eleven single models are not.\n\nThe files are cloud-optimised GeoTIFF, listed in the [map layer manifest](dataset:SCATTER_MAPS)."),
      _issues: eng('Known defect of the published files: the natural-dispersal binary rasters carry no coordinate reference system. They sit on the 10 km INSPIRE EPSG:3035 grid of the potential ones, cropped by whole cells (verified), and the served copies have the coordinate reference system assigned.'),
      _references: {
        _citation: ['Mauri, A., Girardello, M., Strona, G., Beck, P.S.A., Forzieri, G., Caudullo, G., Manca, F., Cescatti, A. (2022). EU-Trees4F, a dataset on the future distribution of European tree species. *Scientific Data* 9:37. doi: [10.1038/s41597-022-01128-5](https://doi.org/10.1038/s41597-022-01128-5)'],
        _url: ['[EU-Trees4F on figshare (CC0)](https://doi.org/10.6084/m9.figshare.c.5525688)'],
      },
    },
    std_dataset_domn: { std_dataset_extent: 'std_dataset_extent_region', std_dataset_scope: 'std_dataset_scope_grid', std_dataset_theme: 'std_dataset_theme_distribution' },
    std_dataset_prop: { _collection_list: ['ScatterMaps'], std_terms: ['species'], std_terms_key: ['species'] },
  },
  {
    std_dataset_code: 'ATLAS_CHOROLOGY_2017',
    std_date_submission: today, std_date_start: '2016', std_date_end: '2016',
    _info: {
      _title: eng("Chorological maps for the main European woody species"),
      _definition: eng("Native and introduced ranges of the main European tree and shrub species, drawn by experts from the botanical literature for the European Atlas of Forest Tree Species."),
      _description: eng("The native and introduced ranges of the main European tree and shrub species, drawn by experts: polygons for continuous areas, points for isolated populations and for synanthropic occurrences. They were compiled for the European Atlas of Forest Tree Species from Meusel & Jäger, Hultén & Fries, the Atlas Florae Europaeae, EUFORGEN and other sources, and cover 145 taxa in 238 layers.\n\nHere they are the range outline drawn on the map. The files are GeoJSON in WGS84, listed in the [map layer manifest](dataset:SCATTER_MAPS)."),
      _references: {
        _citation: ['Caudullo, G., Welk, E., San-Miguel-Ayanz, J. (2017). Chorological maps for the main European woody species. *Data in Brief* 12:662–666. doi: [10.1016/j.dib.2017.05.007](https://doi.org/10.1016/j.dib.2017.05.007)'],
        _url: ['[Chorological maps on Mendeley Data (CC BY 4.0)](https://data.mendeley.com/datasets/hr5h2hcgg4)'],
      },
    },
    std_dataset_domn: { std_dataset_extent: 'std_dataset_extent_region', std_dataset_scope: 'std_dataset_scope_shape', std_dataset_theme: 'std_dataset_theme_distribution' },
    std_dataset_prop: { _collection_list: ['ScatterMaps'], std_terms: ['species'], std_terms_key: ['species'] },
  },
  {
    std_dataset_code: 'ATLAS_RPP_2016',
    std_date_submission: today, std_date_start: '2016', std_date_end: '2016',
    _info: {
      _title: eng("European Atlas: relative probability of presence"),
      _definition: eng("Relative probability of presence of tree taxa, modelled from harmonised forest plot data (C-SMFA model); European Atlas of Forest Tree Species, Joint Research Centre, 2016."),
      _description: eng("The relative probability of presence of 39 tree taxa on a 1 km grid, from the European Atlas of Forest Tree Species (Joint Research Centre, 2016). It is modelled, not interpolated: a constrained spatial multi-frequency analysis (C-SMFA) of the same harmonised forest plot data as [EU-Forest](dataset:EU-FOREST_2017), constrained by land cover.\n\nHere it is the species layer the map shows first. The Atlas also maps where conditions suit each taxon, as [maximum habitat suitability](dataset:ATLAS_MHS_2016).\n\nThe maps may be reused under the reuse policy of the European Commission (Decision 2011/833/EU, that is CC BY 4.0). Each layer has its own DOI in the JRC Data Catalogue, recorded with its file in the [map layer manifest](dataset:SCATTER_MAPS). The files are cloud-optimised GeoTIFF."),
      _references: {
        _citation: ['de Rigo, D., Caudullo, G., Houston Durrant, T., San-Miguel-Ayanz, J. (2016). The European Atlas of Forest Tree Species: modelling, data and information on forest tree species. In: San-Miguel-Ayanz, J. et al. (eds.), European Atlas of Forest Tree Species. Publ. Off. EU, Luxembourg, pp. e01aa69+. [w3id.org/mtv/FISE-Comm/v01/e01aa69](https://w3id.org/mtv/FISE-Comm/v01/e01aa69)'],
        _url: ['[Atlas data and metadata](https://forest.jrc.ec.europa.eu/en/european-atlas/atlas-data-and-metadata/)'],
      },
    },
    std_dataset_domn: { std_dataset_extent: 'std_dataset_extent_region', std_dataset_scope: 'std_dataset_scope_grid', std_dataset_theme: 'std_dataset_theme_distribution' },
    std_dataset_prop: { std_dataset_resolution_source: 1000, _collection_list: ['ScatterMaps'], std_terms: ['species'], std_terms_key: ['species'] },
  },
  {
    std_dataset_code: 'ATLAS_MHS_2016',
    std_date_submission: today, std_date_start: '2016', std_date_end: '2016',
    _info: {
      _title: eng("European Atlas: maximum habitat suitability"),
      _definition: eng("Maximum habitat suitability of tree taxa, modelled from the bioclimate of the plots where each taxon occurs (RDS-MHS model); European Atlas of Forest Tree Species, Joint Research Centre, 2016."),
      _description: eng("The maximum habitat suitability of 27 tree taxa on a 1 km grid, from the European Atlas of Forest Tree Species (Joint Research Centre, 2016). The model (RDS-MHS, relative distance similarity) measures how similar the bioclimate of each cell is to the bioclimate of the plots where the taxon occurs, with WorldClim 1.4 climate and GMTED2010 terrain as covariates.\n\nIt stands beside the [relative probability of presence](dataset:ATLAS_RPP_2016) of the same Atlas as a second species layer of the map.\n\nThe maps may be reused under the reuse policy of the European Commission (CC BY 4.0). Each layer has its own DOI in the JRC Data Catalogue, recorded with its file in the [map layer manifest](dataset:SCATTER_MAPS). The files are cloud-optimised GeoTIFF."),
      _references: {
        _citation: ['de Rigo, D., Caudullo, G., Houston Durrant, T., San-Miguel-Ayanz, J. (2016). The European Atlas of Forest Tree Species: modelling, data and information on forest tree species. In: San-Miguel-Ayanz, J. et al. (eds.), European Atlas of Forest Tree Species. Publ. Off. EU, Luxembourg, pp. e01aa69+. [w3id.org/mtv/FISE-Comm/v01/e01aa69](https://w3id.org/mtv/FISE-Comm/v01/e01aa69)'],
        _url: ['[Atlas data and metadata](https://forest.jrc.ec.europa.eu/en/european-atlas/atlas-data-and-metadata/)'],
      },
    },
    std_dataset_domn: { std_dataset_extent: 'std_dataset_extent_region', std_dataset_scope: 'std_dataset_scope_grid', std_dataset_theme: 'std_dataset_theme_distribution' },
    std_dataset_prop: { std_dataset_resolution_source: 1000, _collection_list: ['ScatterMaps'], std_terms: ['species'], std_terms_key: ['species'] },
  },
)

const SCATTER_TERMS = () => Object.values(GID)
RECORDS.push(
  {
    std_dataset_code: 'SCATTER_OCCURRENCES',
    std_date_submission: today, std_date_start: '1961', std_date_end: '2100',
    _info: {
      _title: eng("EU-Forest cells in present and future climate"),
      _definition: eng("Species observed in each cell surveyed by EU-Forest, with the climate indicators of the cell from EU-Trees4F, WorldClim 2.1 and CHELSA 2.1, for the reference periods and for modelled future periods to 2100."),
      _description: eng("The data behind the base layer and the species layer of the climatic niche scatterplots: one record for each of the 250 569 cells of 1 km surveyed in [EU-Forest](dataset:EU-FOREST_2017), with the species observed there, the centre of the cell and the climate of the cell. As in the autoecology diagrams of the European Atlas of Forest Tree Species, all the cells together form the base layer, and the cells where a species was observed form the layer of that species.\n\nThe climate comes from three sources, kept side by side so that the same indicator can be compared between them:\n\n**[EU-Trees4F predictors](dataset:EU-TREES4F_PREDICTORS_2022)**, at 10 km: 1961–1990, then 1991–2020, 2021–2050 and 2051–2080 under RCP 4.5 and RCP 8.5.\n\n**[WorldClim 2.1](dataset:WORLDCLIM_V2.1)**, at 1 km: 1970–2000, then four periods from 2021 to 2100.\n\n**[CHELSA 2.1](dataset:CHELSA_V2.1)**, at 1 km: 1981–2010, then three periods from 2011 to 2100.\n\nThe futures of the two sources at 1 km come from the MPI-ESM1-2-HR model under the SSP3-7.0 scenario.\n\nEach cell carries the annual indicators and those derived from monthly values: summer and winter means, continentality, coldest-month temperature, spring-summer radiation and the seasonality ratio. A future value is the climate projected for the place of a present occurrence; it does not say that the species will still be there."),
      _methods: eng("The centre of each EU-Forest cell is reprojected to WGS84 and read in the grid cell that contains it, at the resolution of each source (1 km for WorldClim 2.1 and CHELSA 2.1, 5 arc-minutes for the EU-Trees4F predictors). Nothing is interpolated and no cell is left out. The values are kept at full precision under `properties`, by source, then by period, then by model and scenario for the futures. The climate cells read are kept in the `ScatterCells` collection."),
      _issues: eng('WorldClim future monthly layers carry only daily extremes, so its future temperature-derived indicators use the mean of the daily maximum and minimum, tas ≈ (tasmax + tasmin) / 2. Radiation exists for the WorldClim historical period only. 1 715 cells lie outside the land mask of the 1 km grids and have no WorldClim or CHELSA values.'),
      _references: { _citation: [CITE.euforest, CITE.eutrees4f, CITE.worldclim, CITE.chelsa], _url: [REPO_URL] },
    },
    std_dataset_domn: { std_dataset_extent: 'std_dataset_extent_region', std_dataset_scope: 'std_dataset_scope_grid', std_dataset_theme: 'std_dataset_theme_scatterplot' },
    std_dataset_prop: { _collection_list: ['ScatterOccurrences', 'ScatterCells'], std_terms: ['species_list', 'geometry_point', 'geometry_hash', ...SCATTER_TERMS()], std_terms_key: ['geometry_point'] },
  },
  {
    std_dataset_code: 'SCATTER_UNITS',
    std_date_submission: today, std_date_start: '1961', std_date_end: '2100',
    _info: {
      _title: eng("Conservation units in present and future climate"),
      _definition: eng("Target species and climate indicators of each EUFGIS gene conservation unit at its climate reference point, from EU-Trees4F, WorldClim 2.1 and CHELSA 2.1, for the reference periods and for modelled future periods to 2100."),
      _description: eng("The data behind the units layer of the climatic niche scatterplots, the layer the application exists for: one record for each of the 3 669 gene conservation units of EUFGIS, with the unit number, its target species and its climate, in the same sources and periods as the [occurrence cells](dataset:SCATTER_OCCURRENCES). It shows where each unit sits in the climate of its species today, and where the coming periods move it.\n\nA unit is read at its climate reference point. The record states that point and its distance from the polygon of the unit, in kilometres (0 when the point lies inside). The reference point is chosen by the manager of the unit and may lie outside the area of the unit or at another elevation. The record therefore also states the climate of the area of the unit in the same sources and periods (its mean over the polygon, and the minimum and maximum found in it, which together state how varied the climate of the unit is) and the elevation at the reference point. The application keeps a unit at its reference point and flags the units whose point lies far from the polygon, or has a climate found nowhere in it.\n\nUnits whose coordinates are restricted carry their climate values, the elevation and the distance only: no point, and no reference to a cell."),
      _methods: eng("Each unit is read at its climate reference point in the same way as the occurrence cells. The distance is measured on the ETRS89-LAEA plane (EPSG:3035). For the climate of the area, each grid cell the polygon intersects counts in proportion to the share of the polygon that falls in it; derived indicators are derived for each cell, then averaged. The minimum and maximum of an indicator are the lowest and highest value among those cells. The records are rebuilt from the EUFGIS units by a refresh command; the date of the last refresh is the submission date of this record."),
      _issues: eng('The polygon of a unit is the border of the area in which the conservation activities are performed: it does not say where in it the target species grow. 26 target species of units (for example *Fagus orientalis*, 28 units) match no occurrence or map source: those units appear without a species layer.'),
      _references: { _citation: [CITE.eutrees4f, CITE.worldclim, CITE.chelsa], _provider: ['[EUFGIS](http://www.eufgis.org)'], _url: [REPO_URL] },
    },
    std_dataset_domn: { std_dataset_extent: 'std_dataset_extent_gcu', std_dataset_scope: 'std_dataset_scope_shape', std_dataset_theme: 'std_dataset_theme_scatterplot' },
    std_dataset_prop: { _collection_list: ['ScatterUnits'], std_terms: ['gcu_id_number', 'species_list', 'gcu_loc_coordinates-restriction', 'gcu_loc_climate', 'gcu_loc_climate_distance', 'gcu_loc_climate_area', 'gcu_loc_climate_area_min', 'gcu_loc_climate_area_max', 'gcu_loc_climate_elevation', 'geometry_point', 'geometry_hash', ...SCATTER_TERMS()], std_terms_key: ['gcu_id_number'] },
  },
  {
    std_dataset_code: 'SCATTER_SPECIES',
    std_date_submission: today, std_date_start: '2016', std_date_end: '2026',
    _info: {
      _title: eng("Species of the scatterplots and maps"),
      _definition: eng("Taxa named by the sources of the scatterplots and the maps, by accepted scientific name, with the occurrences, distribution maps and conservation units that exist for each."),
      _description: eng("The list of the 271 taxa named by any source of the scatterplots and the maps. A taxon is identified by its scientific name, with synonyms folded into the accepted name. For each taxon the record states what exists: the number of [EU-Forest](dataset:EU-FOREST_2017) occurrences, and whether there are [EU-Trees4F maps](dataset:EU-TREES4F_MAPS_2022), Atlas maps of [presence](dataset:ATLAS_RPP_2016) and of [suitability](dataset:ATLAS_MHS_2016), and [gene conservation units](dataset:SCATTER_UNITS) that have it as target species.\n\nIt is a catalogue, not geographic data: its extent and scope are those of the data it indexes. The key of a record is not the name, so that UPOV codes can be added later without changing the records that refer to a taxon."),
      _references: { _url: ['[climatic-niche-scatterplots on GitHub](https://github.com/skofic/climatic-niche-scatterplots)'] },
    },
    std_dataset_domn: { std_dataset_extent: 'std_dataset_extent_region', std_dataset_scope: 'std_dataset_scope_grid', std_dataset_theme: 'std_dataset_theme_scatterplot' },
    std_dataset_prop: { _collection_list: ['ScatterSpecies'], std_terms: ['species'], std_terms_key: ['species'] },
  },
  {
    std_dataset_code: 'SCATTER_MAPS',
    std_date_submission: today, std_date_start: '2005', std_date_end: '2095',
    _info: {
      _title: eng("Map layer manifest"),
      _definition: eng("Map files served by the application, one entry per file: species, source, period, scenario and variant, with the projection, licence and citation of the file."),
      _description: eng("The list of the map files the application serves, one record for each file: the [EU-Trees4F suitability maps](dataset:EU-TREES4F_MAPS_2022) for the current and future periods, the Atlas maps of [relative probability of presence](dataset:ATLAS_RPP_2016) and of [maximum habitat suitability](dataset:ATLAS_MHS_2016) at 1 km, and the [range outlines](dataset:ATLAS_CHOROLOGY_2017). The grids are cloud-optimised GeoTIFF files, the outlines GeoJSON.\n\nEach record states the species, the source, the period, the scenario and the variant of the map, then the file, its projection and resolution, its licence and its citation.\n\nIt is a catalogue of files, not geographic data itself."),
      _references: { _url: ['[climatic-niche-scatterplots on GitHub](https://github.com/skofic/climatic-niche-scatterplots)'] },
    },
    std_dataset_domn: { std_dataset_extent: 'std_dataset_extent_region', std_dataset_scope: 'std_dataset_scope_grid', std_dataset_theme: 'std_dataset_theme_scatterplot' },
    std_dataset_prop: { _collection_list: ['ScatterMaps'], std_terms: ['species'], std_terms_key: ['species'] },
  },
)

export async function ensureDatasetRecords(db, datasetCollection, { write = false, dictionary = null, missing = [], update = false } = {}) {
  const coll = db.collection(datasetCollection)
  const keys = {}
  for (const original of RECORDS) {
    const rec = structuredClone(original)
    const dropped = (rec.std_dataset_prop.std_terms ?? []).filter((g) => missing.includes(g))
    if (dropped.length) {
      rec.std_dataset_prop.std_terms = rec.std_dataset_prop.std_terms.filter((g) => !missing.includes(g))
      console.log(`  ${rec.std_dataset_code}: std_terms without ${dropped.join(', ')} (not in the dictionary yet)`)
    }
    if (dictionary) {
      // the schema requires _key, which the collection assigns at insertion: validate with a placeholder
      const r = validator.validateByDictionary({ _key: 'pending', ...rec }, 'std_dataset', dictionary, { strict: false })
      if (r.errors.length) throw new Error(`Dataset record ${rec.std_dataset_code} invalid: ${JSON.stringify(r.errors.slice(0, 3))}`)
      if (r.warnings.length) console.warn(`  ${rec.std_dataset_code}: ${r.warnings.length} warning(s), e.g. ${r.warnings[0].code} ${r.warnings[0].path}`)
    }
    const found = await db.query('FOR d IN @@c FILTER d.std_dataset_code == @code RETURN d._key', { '@c': datasetCollection, code: rec.std_dataset_code }).then((c) => c.all())
    if (found.length) {
      keys[rec.std_dataset_code] = found[0]
      if (update && write) { await coll.update(found[0], { _info: rec._info, std_dataset_domn: rec.std_dataset_domn, std_dataset_prop: rec.std_dataset_prop }); console.log(`  ${rec.std_dataset_code}: updated`) }
      continue
    }
    if (!write) { keys[rec.std_dataset_code] = null; continue }
    const ins = await coll.save(rec)
    keys[rec.std_dataset_code] = ins._key
  }
  return keys
}

if (process.argv[1].endsWith('records.js')) {
  try {
    const write = process.argv.includes('--write')
    const update = process.argv.includes('--update')
    const creds = loadCredentials()
    const { db, collections } = connect(creds, { requireLoadTarget: write })
    const { dictionary, missing } = await loadDictionary(datasetGids(), creds)
    if (missing.includes('std_dataset')) throw new Error('dictionary lacks std_dataset')
    const keys = await ensureDatasetRecords(db, collections.dataset, { write, dictionary, missing, update })
    console.log(write ? 'Dataset records:' : 'Dataset records (dry run, nothing written):', keys)
  } catch (err) { console.error(explain(err)); process.exit(1) }
}
