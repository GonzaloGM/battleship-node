const gameConstants = require("./games/gamesConstants");

module.exports = {
  openapi: "3.0.0",
  info: {
    description:
      "Battleship API. Read the readme in the repository for further information.",
    version: "1.0.0",
    title: "Battleship",
    contact: { email: "gonzalo@gonzalezmora.com" },
    license: {
      name: "Apache 2.0",
      url: "http://www.apache.org/licenses/LICENSE-2.0.html"
    }
  },
  servers: [
    {
      url: "https://battleship-gonzalogm.herokuapp.com/v1",
      description: "Heroku"
    },
    {
      url: "http://localhost:3000/v1",
      description: "localhost"
    }
  ],
  tags: [
    {
      name: "games",
      description: "Operations about games"
    },
    {
      name: "sessions",
      description: "Login operation"
    },
    {
      name: "users",
      description: "Operations about users"
    }
  ],
  schemes: ["https"],
  paths: {
    "/games": {
      post: {
        tags: ["games"],
        summary: "Creates a new game",
        description: "",
        operationId: "createGame",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description:
              "Creates a new game. Difficulty needs to be set, otherwise it will be NORMAL.",
            required: true,
            schema: { $ref: "#/components/schemas/CreateGame" }
          }
        ],
        responses: {
          "200": {
            description: "Game created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BoardAndMessageResponse"
                }
              }
            }
          },
          "400": {
            description: "Invalid request (difficulty not set or invalid)"
          },
          "401": {
            description:
              "Unauthorized. You probably need to log in and set Bearer Token Authorization headers."
          }
        },
        security: {
          bearerAuth: []
        }
      },
      get: {
        tags: ["games"],
        summary: "Gets a list of games",
        description:
          "Gets a list of games. This game list is filterable and sortable using query string parameters. If filters are invalid, they're discarded.",
        operationId: "getGames",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "query",
            name: "sort",
            description:
              "Sort for games list. You can sort by `status`, `startDate`, `endDate`, `result` and `turnsUsed`. They have the format of `property <asc|desc>`. Example: `sort=status desc`.",
            schema: {
              type: "string"
            },
            example: "status desc"
          },
          {
            in: "query",
            name: "filter",
            description:
              "Filter for games list. You can filter by `status` and/or `result`. They have the format of `property " +
              "value[,property2 value]`. Example: `filter=status active,result won`. Possible values for `status`: `active`, " +
              "`finished`. Possible values for `result`: `won`, `lost`, `surrendered`",
            schema: {
              type: "string"
            },
            example: "status active,result won"
          }
        ],
        responses: {
          "200": {
            description: "Games list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/GameItem"
                  }
                }
              }
            }
          },
          "401": {
            description:
              "Unauthorized. You probably need to log in and set Bearer Token Authorization headers."
          },
          "404": { description: "No games found" }
        },
        security: {
          bearerAuth: []
        }
      }
    },
    "/games/{id}": {
      get: {
        tags: ["games"],
        summary: "Gets a specific game by _id",
        description: "Gets a specific game by _id",
        operationId: "getGame",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Game _id to retrieve",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "Retrieved game",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GameItem"
                }
              }
            }
          },
          "401": {
            description:
              "Unauthorized. You probably need to log in and set Bearer Token Authorization headers."
          }
        },
        security: {
          bearerAuth: []
        }
      },
      delete: {
        tags: ["games"],
        summary: "Deletes a game",
        description: "",
        operationId: "deleteGame",
        consumes: ["application/json"],
        produces: ["application/json"],
        responses: {
          "200": {
            description: "Game Deleted",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse"
                }
              }
            }
          },
          "401": {
            description:
              "Unauthorized. You probably need to log in and set Bearer Token Authorization headers."
          },
          "404": { description: "No game to delete found" }
        },
        security: {
          bearerAuth: []
        }
      }
    },
    "/games/{id}/newMove": {
      post: {
        tags: ["games"],
        summary: "Makes a new move in the game",
        description: "Makes a new move in the game",
        operationId: "newMove",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "The coordinates where to shoot.",
            required: true,
            schema: { $ref: "#/components/schemas/NewMoveRequest" }
          },
          {
            name: "id",
            in: "path",
            description: "Game _id in which to make the move",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "New Game State",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageAndBoardResponse"
                }
              }
            }
          },
          "401": {
            description:
              "Unauthorized. You probably need to log in and set Bearer Token Authorization headers."
          },
          "404": { description: "No game to make the move on found" }
        },
        security: {
          bearerAuth: []
        }
      }
    },
    "/games/{id}/surrender": {
      post: {
        tags: ["games"],
        summary: "Surrenders the game",
        description: "Surrenders the game",
        operationId: "newMove",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Game _id to surrender",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "Response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageAndBoardResponse"
                }
              }
            }
          },
          "401": {
            description:
              "Unauthorized. You probably need to log in and set Bearer Token Authorization headers."
          },
          "404": { description: "No game to surrender in found" }
        },
        security: {
          bearerAuth: []
        }
      }
    },
    "/users": {
      post: {
        tags: ["users"],
        summary: "Signs up as a new user",
        description: "",
        operationId: "newUser",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description:
              "Creates a new user. You can login on `POST /sessions/` with the same email and password.",
            required: true,
            schema: { $ref: "#/components/schemas/NewUserRequest" }
          }
        ],
        responses: {
          "200": {
            description: "Game created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse"
                }
              }
            }
          },
          "400": {
            description:
              "Invalid request (email and password not set or invalid)"
          },
          "401": {
            description:
              "Unauthorized. You probably need to log in and set Bearer Token Authorization headers."
          }
        },
        security: {
          bearerAuth: []
        }
      },
      get: {
        tags: ["users"],
        summary: "Gets a list of users",
        description:
          "Gets a list of users. Needs admin privileges (check Readme).",
        operationId: "getUsers",
        consumes: ["application/json"],
        produces: ["application/json"],
        responses: {
          "200": {
            description: "Users list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/UserItem"
                  }
                }
              }
            }
          },
          "401": {
            description:
              "Unauthorized. You probably need to log in and set Bearer Token Authorization headers."
          },
          "404": { description: "No users found" }
        },
        security: {
          bearerAuth: []
        }
      }
    },
    "/users/{id}": {
      get: {
        tags: ["users"],
        summary: "Gets a user",
        description: "Gets a user. Needs admin privileges (check Readme).",
        operationId: "getUser",
        consumes: ["application/json"],
        produces: ["application/json"],
        responses: {
          "200": {
            description: "User",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserItem"
                }
              }
            }
          },
          "401": {
            description:
              "Unauthorized. You probably need to log in and set Bearer Token Authorization headers."
          },
          "404": { description: "No user found" }
        },
        security: {
          bearerAuth: []
        }
      },
      put: {
        tags: ["users"],
        summary: "Updates a user",
        description: "",
        operationId: "updateUser",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description:
              "Updates a user. Needs admin privileges (check Readme).",
            required: true,
            schema: { $ref: "#/components/schemas/UpdateUserRequest" }
          }
        ],
        responses: {
          "200": {
            description: "User updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse"
                }
              }
            }
          },
          "400": {
            description:
              "Invalid request (email and password not set or invalid)"
          },
          "401": {
            description:
              "Unauthorized. You probably need to log in and set Bearer Token Authorization headers."
          }
        },
        security: {
          bearerAuth: []
        }
      },
      delete: {
        tags: ["users"],
        summary: "Deletes a user. Needs admin privileges (check Readme).",
        description: "",
        operationId: "deleteUser",
        consumes: ["application/json"],
        produces: ["application/json"],
        responses: {
          "200": {
            description: "User Deleted",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse"
                }
              }
            }
          },
          "401": {
            description:
              "Unauthorized. You probably need to log in and set Bearer Token Authorization headers."
          },
          "404": { description: "No user to delete found" }
        },
        security: {
          bearerAuth: []
        }
      }
    },
    "/sessions": {
      post: {
        tags: ["sessions"],
        summary: "Log in",
        description: "",
        operationId: "login",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Logs in a new user.",
            required: true,
            schema: {
              $ref: "#/components/schemas/NewSessionRequest"
            }
          }
        ],
        responses: {
          "200": {
            description:
              "Returns Bearer Token for Authorization on other endpoints",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BearerTokenResponse"
                }
              }
            }
          },
          "401": {
            description:
              "Unauthorized. You probably need to log in and set Bearer Token Authorization headers."
          }
        },
        security: {
          bearerAuth: []
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      BoardAndMessageResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Message to the user"
          },
          board: {
            type: "array",
            items: {
              type: "string"
            },
            description: "A game board representation for easier playing."
          }
        }
      },
      MessageResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Message to the user"
          }
        }
      },
      BearerTokenResponse: {
        type: "object",
        properties: {
          token: {
            type: "string",
            description: "Bearer Token for Authorization header"
          }
        }
      },
      CreateGame: {
        type: "object",
        properties: {
          difficulty: {
            type: "integer",
            description:
              "Game difficulty. 0: Easy, 1: Normal. 2: Hard. TODO: Get from constants file.",
            minimum: 0,
            maximum: 2,
            default: 1
          }
        }
      },
      NewUserRequest: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Email",
            required: true
          },
          password: {
            type: "string",
            description: "Password",
            required: true
          }
        }
      },
      NewSessionRequest: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Email to login with.",
            required: true
          },
          password: {
            type: "string",
            description: "Password to login with.",
            required: true
          }
        }
      },
      UpdateUserRequest: {
        type: "object",
        properties: {
          userInfo: {
            schema: {
              $ref: "#/components/schemas/UserItem"
            },
            description: "User properties to update.",
            required: true
          }
        }
      },
      NewMoveRequest: {
        type: "object",
        properties: {
          coordinateX: {
            type: "integer",
            description: "Horizontal coordinate. Min: 0. Max: 9",
            minimum: 0,
            maximum: 9,
            required: true
          },
          coordinateY: {
            type: "integer",
            description: "Vertical coordinate. Min: 0. Max: 9",
            minimum: 0,
            maximum: 9,
            required: true
          }
        }
      },
      GameItem: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Game _id"
          },
          startDate: {
            type: "string",
            description: "ISO Date for the game creation date"
          },
          endDate: {
            type: "string",
            description: "ISO Date for the game end date"
          },
          result: {
            type: "integer",
            description: "Game result. 0: LOST, 1: WON, 2: SURRENDERED"
          },
          status: {
            type: "integer",
            description: "Game status. 0: ACTIVE, 1: FINISHED"
          }
        }
      },
      UserItem: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Game _id"
          },
          isAdmin: {
            type: "boolean",
            description: "Is this user an admin?"
          },
          email: {
            type: "string",
            description: "Email for this user"
          }
        }
      }
    }
  },
  definitions: {
    Order: {
      type: "object",
      properties: {
        id: { type: "integer", format: "int64" },
        petId: { type: "integer", format: "int64" },
        quantity: { type: "integer", format: "int32" },
        shipDate: { type: "string", format: "date-time" },
        status: {
          type: "string",
          description: "Order Status",
          enum: ["placed", "approved", "delivered"]
        },
        complete: { type: "boolean", default: false }
      },
      xml: { name: "Order" }
    },
    User: {
      type: "object",
      properties: {
        id: { type: "integer", format: "int64" },
        username: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
        phone: { type: "string" },
        userStatus: {
          type: "integer",
          format: "int32",
          description: "User Status"
        }
      },
      xml: { name: "User" }
    },
    Category: {
      type: "object",
      properties: {
        id: { type: "integer", format: "int64" },
        name: { type: "string" }
      },
      xml: { name: "Category" }
    },
    Tag: {
      type: "object",
      properties: {
        id: { type: "integer", format: "int64" },
        name: { type: "string" }
      },
      xml: { name: "Tag" }
    },
    Pet: {
      type: "object",
      required: ["name", "photoUrls"],
      properties: {
        id: { type: "integer", format: "int64" },
        category: { $ref: "#/definitions/Category" },
        name: { type: "string", example: "doggie" },
        photoUrls: {
          type: "array",
          xml: { name: "photoUrl", wrapped: true },
          items: { type: "string" }
        },
        tags: {
          type: "array",
          xml: { name: "tag", wrapped: true },
          items: { $ref: "#/definitions/Tag" }
        },
        status: {
          type: "string",
          description: "pet status in the store",
          enum: ["available", "pending", "sold"]
        }
      },
      xml: { name: "Pet" }
    },
    ApiResponse: {
      type: "object",
      properties: {
        code: { type: "integer", format: "int32" },
        type: { type: "string" },
        message: { type: "string" }
      }
    }
  },
  externalDocs: {
    description: "Find out more about Swagger",
    url: "http://swagger.io"
  }
};
