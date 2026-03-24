# WLL.wtf
A working load limit (WLL) calculator for suspension practitioners


## Query Parameters

The app supports pre-populating calculator values from the URL query string.

### Supported Parameters

- `cord`
  - Selects a preset cord by its `id` from `cord.json`
  - Examples:
    - `samson_amsteel_blue_1_8`
    - `qnr_polyester_3_16`
    - `qnr_polyester_1_8`

- `u`
  - Sets display units
  - Supported values:
    - `lbs`
    - `kg`

- `sf`
  - Sets the safety factor
  - Example: `10`

- `load`
  - Sets the estimated load
  - Example: `200`

- `fc`
  - Sets the fiber class when `cord` is not provided
  - Supported values:
    - `1`
    - `2`

- `mbs`
  - Sets the minimum breaking strength when `cord` is not provided
  - Example: `770`

### Notes

- If `cord` is provided, the app loads the preset cord data and does not apply `fc` and `mbs` from the URL.
- `u`, `sf`, and `load` can be combined with either a preset `cord` or manual `fc` and `mbs` values.

### Example URLs

- Preset cord:
  - `https://www.wll.wtf/?cord=samson_amsteel_blue_1_8`

- Preset cord with load, safety factor, and units:
  - `https://www.wll.wtf/?cord=samson_amsteel_blue_1_8&load=200&sf=10&u=lbs`

- Manual values without a preset cord:
  - `https://www.wll.wtf/?fc=1&mbs=770&load=200&sf=10&u=lbs`
