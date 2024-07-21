import React from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const materials = [
  { name: "Cotton", value: "Cotton" },
  { name: "Polyester", value: "Polyester" },
  { name: "Linen", value: "Linen" },
  { name: "Silk", value: "Silk" },
  { name: "Other", value: "Other" },
];

const colors = [
  { name: "Neutrals", value: "Neutrals" },
  { name: "Brights", value: "Brights" },
  { name: "Black", value: "Black" },
  { name: "White", value: "White" },
  { name: "Other", value: "Other" },
];

const ages = [
  { name: "0-2 years", value: "0-2" },
  { name: "3-5 years", value: "3-6" },
  { name: "5+ years", value: "5+" },
];

const FiltersShirts = ({ showFilters, setShowFilters, filters, setFilters, fetchData }) => {
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    const newFilters = { ...filters };

    if (checked) {
      newFilters[name].push(value);
    } else {
      newFilters[name] = newFilters[name].filter((item) => item !== value);
    }

    setFilters(newFilters);
    fetchData(); // Fetch data whenever filters are updated
  };

  return (
    <Box
      sx={{
        display: showFilters ? "block" : "none",
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginBottom: "16px",
      }}
    >
      <IconButton
        sx={{ float: "right", padding: "0" }}
        onClick={() => setShowFilters(false)}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h6">Filters</Typography>
      <Divider sx={{ my: 1 }} />

      <Typography variant="subtitle1">Material</Typography>
      <FormGroup>
        {materials.map((material) => (
          <FormControlLabel
            key={material.value}
            control={
              <Checkbox
                checked={filters.material.includes(material.value)}
                onChange={handleChange}
                name="material"
                value={material.value}
              />
            }
            label={material.name}
          />
        ))}
      </FormGroup>
      <Divider sx={{ my: 1 }} />

      <Typography variant="subtitle1">Color</Typography>
      <FormGroup>
        {colors.map((color) => (
          <FormControlLabel
            key={color.value}
            control={
              <Checkbox
                checked={filters.color.includes(color.value)}
                onChange={handleChange}
                name="color"
                value={color.value}
              />
            }
            label={color.name}
          />
        ))}
      </FormGroup>
      <Divider sx={{ my: 1 }} />

      <Typography variant="subtitle1">Age</Typography>
      <FormGroup>
        {ages.map((age) => (
          <FormControlLabel
            key={age.value}
            control={
              <Checkbox
                checked={filters.age.includes(age.value)}
                onChange={handleChange}
                name="age"
                value={age.value}
              />
            }
            label={age.name}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default FiltersShirts;
