import { HttpResponse, http } from "msw"

export default [
  http.get(
    `https://data.commercelayer.app/assets/lists/countries.json`,
    async () => {
      return HttpResponse.json([
        {
          label: "Angola",
          value: "AO",
        },
        {
          label: "Hungary",
          value: "HU",
        },
        {
          label: "Iraq",
          value: "IQ",
        },
        {
          label: "Ireland",
          value: "IE",
        },
        {
          label: "Italy",
          value: "IT",
        },
        {
          label: "Jamaica",
          value: "JM",
        },
        {
          label: "Japan",
          value: "JP",
        },
        {
          label: "Philippines",
          value: "PH",
        },
        {
          label: "Pitcairn Island",
          value: "PN",
        },
        {
          label: "Poland",
          value: "PL",
        },
        {
          label: "Portugal",
          value: "PT",
        },
        {
          label: "United Kingdom",
          value: "GB",
        },
        {
          label: "United States",
          value: "US",
        },
        {
          label: "United States Minor Outlying Islands",
          value: "UM",
        },
        {
          label: "Uruguay",
          value: "UY",
        },
      ])
    },
  ),
  http.get(
    `https://data.commercelayer.app/assets/lists/states/IT.json`,
    async () => {
      return HttpResponse.json([
        {
          label: "Agrigento",
          value: "AG",
        },
        {
          label: "Alessandria",
          value: "AL",
        },
        {
          label: "Como",
          value: "CO",
        },
        {
          label: "Firenze",
          value: "FI",
        },
        {
          label: "Genoa",
          value: "GE",
        },
        {
          label: "Milano",
          value: "MI",
        },
        {
          label: "Napoli",
          value: "NA",
        },
      ])
    },
  ),
  http.get(
    `https://data.commercelayer.app/assets/lists/states/US.json`,
    async () => {
      return HttpResponse.json([
        {
          label: "Alabama",
          value: "AL",
        },
        {
          label: "Alaska",
          value: "AK",
        },
        {
          label: "Arizona",
          value: "AZ",
        },
        {
          label: "Arkansas",
          value: "AR",
        },
        {
          label: "California",
          value: "CA",
        },
        {
          label: "Colorado",
          value: "CO",
        },
        {
          label: "Connecticut",
          value: "CT",
        },
        {
          label: "Delaware",
          value: "DE",
        },
        {
          label: "District of Columbia",
          value: "DC",
        },
      ])
    },
  ),
]
