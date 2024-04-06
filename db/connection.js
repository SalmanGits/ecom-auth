const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

if (process.env.NODE_ENV !== "production") {
  prisma.$on("query", async (e) => {
    console.log(`${e.query} ${e.params}`)
  });
}

module.exports = prisma