import type { Database } from "./database.types";
import type { Locale } from "./i18n";

export type Companion = {
  fullName: string;
  meal: "meat" | "fish" | "vegetarian";
  restrictions?: string;
};

type AnswerRow = Database["public"]["Tables"]["awnsers"]["Row"];
type AnswerInsertRaw = Database["public"]["Tables"]["awnsers"]["Insert"];
type AnswerUpdateRaw = Database["public"]["Tables"]["awnsers"]["Update"];

export type Participant = Omit<AnswerRow, "accompanists" | "lang"> & {
  accompanists: Companion[];
  email?: string;
  attending: boolean | null;
  meal_choice: Companion["meal"] | null;
  lang: Locale;
};

export type ParticipantInsert = Omit<
  AnswerInsertRaw,
  "accompanists" | "lang"
> & {
  accompanists: Companion[];
  email?: string;
  attending?: boolean | null;
  meal_choice?: Companion["meal"] | null;
  lang: Locale;
};

export type ParticipantUpdate = Omit<
  AnswerUpdateRaw,
  "accompanists" | "lang"
> & {
  accompanists?: Companion[];
  email?: string;
  attending?: boolean | null;
  meal_choice?: Companion["meal"] | null;
  lang?: Locale;
};
