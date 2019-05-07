const faker = require("faker");
const chai = require("chai");
const { assert } = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
chai.should();

describe("Sessions", () => {
  describe("POST /", () => {
    it("should login with an existing user", async () => {
      // TODO: Move user creation to test helper
      const randomEmail = faker.internet.email();
      const randomPassword = faker.internet.password();
      const responseCreateUser = await chai
        .request(app)
        .post("/v1/users")
        .send({ email: randomEmail, password: randomPassword });

      responseCreateUser.should.have.status(200);
      responseCreateUser.body.should.be.a("object");
      assert.equal(responseCreateUser.body.message, "User created");

      const responseLogin = await chai
        .request(app)
        .post("/v1/sessions")
        .send({ email: randomEmail, password: randomPassword });

      responseLogin.should.have.status(200);
      responseLogin.body.should.be.a("object").that.contains.keys("token");
      assert.typeOf(responseLogin.body.token, "string");
    });
  });
});
