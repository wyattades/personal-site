type TimestampString =
  `${number}-${number}-${number}T${number}:${number}:${number}${
    | "Z"
    | `${"+" | "-"}${number}:${number}`}`;

type DateString = `${number}-${number}-${number}`;

declare namespace NodeJS {
  interface Require {
    context(
      path: string,
      deep?: boolean,
      filter?: RegExp,
      mode?: "sync" | "eager" | "weak" | "lazy" | "lazy-once",
    ): __WebpackModuleApi.RequireContext;
  }
}
