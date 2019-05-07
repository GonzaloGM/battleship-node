const faker = require("faker");
const chai = require("chai");
const { assert } = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
chai.should();

describe("Users", () => {
  describe("POST /", () => {
    it("should create a new user", done => {
      const randomEmail = faker.internet.email();
      const randomPassword = faker.internet.password();
      chai
        .request(app)
        .post("/v1/users")
        .send({ email: randomEmail, password: randomPassword })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          assert.equal(res.body.message, "User created");
          done();
        });
    });
  });

  // TODO: test other endpoints
});
