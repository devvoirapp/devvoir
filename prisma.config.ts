import "dotenv/config";
import {defineConfig, env, PrismaConfigInternal} from "prisma/config";
import {PrismaConfig} from "prisma";

const config: PrismaConfigInternal = defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: env("DATABASE_URL"),
    },
}) satisfies PrismaConfig;

export default config
