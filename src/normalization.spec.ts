import data from "./data.json";
import { reducer } from "./normalization";

describe("Normalized Posts", () => {
  it("reducer should take in un-normalized posts and normalize them", () => {
    const actual = reducer(data);
    const expected = {
      entities: {
        comments: {
          jsyrjkxwtpmu: {
            id: "jsyrjkxwtpmu",
            userId: "hqhhywrxpprz",
            body:
              "Sint deserunt assumenda voluptas doloremque repudiandae. Et magni voluptatem ut consequatur velit autem omnis reiciendis exercitationem. Esse totam minima. Fugit libero natus velit molestiae autem officiis vel.",
            createdAt: "Fri, 25 Sep 2020 18:03:26 GMT",
          },
          masffvxrkbpy: {
            id: "masffvxrkbpy",
            userId: "xcvzaeuonhbb",
            body:
              "Aut dolorum nostrum veniam repellat non ut tempore nisi. Blanditiis ut saepe qui sint officiis quibusdam. Dolores adipisci minus dolor accusantium quod mollitia officiis quo architecto.",
            createdAt: "Sun, 27 Sep 2020 03:11:48 GMT",
          },
        },
        posts: {
          xlkxhemkuiam: {
            id: "xlkxhemkuiam",
            userId: "lswamlcggqlw",
            body:
              "Beatae distinctio libero voluptates nobis voluptatem. Autem minima cupiditate et molestiae nihil. Omnis possimus inventore doloremque quam consequatur. Consequatur minima rem. Aliquid hic in eligendi corporis odio velit fuga vel.",
            createdAt: "Tue, 22 Sep 2020 16:28:53 GMT",
            title: "voluptates sequi et praesentium eos consequatur cumque omnis",
            comments: ["jsyrjkxwtpmu"],
          },
          iplxaztsfihe: {
            id: "iplxaztsfihe",
            userId: "mxoxcnhesbgh",
            body:
              "Soluta quis aut ducimus sed eos omnis nobis sunt nostrum. Cum itaque delectus et error doloremque. Occaecati voluptates aut molestias in voluptate nihil nulla ut odit.",
            createdAt: "Sat, 26 Sep 2020 14:11:39 GMT",
            title: "velit rerum et unde illo eum officia in",
            comments: ["masffvxrkbpy"],
          },
        },
        users: {
          lswamlcggqlw: {
            id: "lswamlcggqlw",
            handle: "Payton_Carter",
            imgUrl: "https://s3.amazonaws.com/uifaces/faces/twitter/dawidwu/128.jpg",
          },
          mxoxcnhesbgh: {
            id: "mxoxcnhesbgh",
            handle: "Foster.Kovacek10",
            imgUrl: "https://s3.amazonaws.com/uifaces/faces/twitter/grrr_nl/128.jpg",
          },
        },
      },
    };

    expect(actual).toStrictEqual(expected);
  });
});
