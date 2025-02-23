type TimestampString =
  `${number}-${number}-${number}T${number}:${number}:${number}${
    | "Z"
    | `${"+" | "-"}${number}:${number}`}`;

type DateString = `${number}-${number}-${number}`;
