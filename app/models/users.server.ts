import { prisma } from "~/db.server";
import { users } from "~/users";

export const getUsers = async () => {
  let usersList = await prisma.vote.groupBy({
    by: ["userId"],
    _count: {
      userId: true,
    },
  });
  return usersList.map((user) => {
    const u = users.find((u) => u.id === user.userId);
    if (!user) throw new Error("user not found");
    return {
      userName: u?.name,
      count: user._count.userId,
      id: user.userId,
    };
  });
};
