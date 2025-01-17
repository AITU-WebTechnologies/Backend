class OrganisationDTO {
  constructor(organisation) {
      this.title = organisation.title;
      this.role = organisation.role;
      this.email = organisation.email;
      this.password = organisation.password
  }
}

module.exports = OrganisationDTO;