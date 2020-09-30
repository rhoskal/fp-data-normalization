import faker from "faker";

import { Posts } from "./types";

const uniqueId = () => faker.random.alpha({ count: 12 });

const recentDate = () => faker.date.recent(7).toUTCString();

const longContent = () => faker.lorem.paragraph(3);

const shortContent = () => faker.lorem.words(8);

const mkUser = () => ({
  id: uniqueId(),
  handle: faker.internet.userName(),
  imgUrl: faker.internet.avatar(),
});

const users = [mkUser(), mkUser(), mkUser()];

// const pickAnotherUser = (u: User) => {};

export const fakeMeSomeData = (): Posts => [
  {
    id: uniqueId(),
    title: shortContent(),
    body: longContent(),
    createdAt: recentDate(),
    user: {
      id: uniqueId(),
      handle: faker.internet.userName(),
      imgUrl: faker.internet.avatar(),
    },
    comments: [
      {
        id: uniqueId(),
        body: longContent(),
        createdAt: recentDate(),
        user: {
          id: uniqueId(),
          handle: faker.internet.userName(),
          imgUrl: faker.internet.avatar(),
        },
      },
    ],
  },
];
