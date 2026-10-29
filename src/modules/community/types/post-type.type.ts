export const POST_TYPE_VALUES = ["HELP_REQUEST", "SHARED_CONTENT"] as const;

export type PostType = (typeof POST_TYPE_VALUES)[number];
