const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errorHandler = require("./errorHandler");
const successHandler = require("./successHandler");
const Headers = require("./headers");

const todos = [];

const reqListener = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk; //分次搬運回來
  });

  if (req.url == "/todos") {
    switch (req.method) {
      // 讀取
      case "GET":
        successHandler(res, todos);
        break;
      // 新增
      case "POST":
        req.on("end", () => {
          try {
            const title = JSON.parse(body).title;
            if (title !== undefined) {
              const todo = {
                title,
                id: uuidv4(),
              };
              todos.push(todo);
              successHandler(res, todos);
            } else {
              errorHandler(res, "400", "title為必須");
            }
          } catch (error) {
            errorHandler(res, "400", "JSON格式錯誤");
          }
        });
        break;
      // 刪除全部
      case "DELETE":
        todos.length = 0;
        successHandler(res, todos);
        break;
      case "OPTIONS":
        successHandler(res, todos);
        break;
      default:
        errorHandler(res, "404", "無此網站路由");
        break;
    }
  } else if (req.url.startsWith("/todos/")) {
    const id = req.url.split("/").pop(); // 此todo的id
    const index = todos.findIndex((element) => element.id == id); // 此id是todos的第幾筆
    switch (req.method) {
      // 刪除單筆
      case "DELETE":
        if (index !== -1) {
          todos.splice(index, 1);
          successHandler(res, todos);
        } else {
          errorHandler(res, "400", "沒有此Todo ID");
        }
        break;
      // 編輯單筆
      case "PATCH":
        req.on("end", () => {
          try {
            const title = JSON.parse(body).title;
            if (index !== -1) {
              todos[index].title = title;
              successHandler(res, todos);
            } else {
              errorHandler(res, "400", "沒有此Todo ID");
            }
            res.end();
          } catch (error) {
            errorHandler(res, "400", "JSON格式錯誤");
          }
        });
        break;
      default:
        break;
    }
  }
};

const server = http.createServer(reqListener); // 進入網頁時觸發
server.listen(3005);
