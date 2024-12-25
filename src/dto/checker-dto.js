class CheckerDTO {
  constructor(checker) {
      this.name = checker.name;
      this.surname = checker.surname;
      this.role = checker.role;
      this.email = checker.email;
      this.password = checker.password;
  }
}

module.exports = CheckerDTO;