const TopupReportsRepository = require("../repository/TopupReportsRepository");

module.exports = class TopupReportsService {
	#repository;

	constructor() {
		this.#repository = new TopupReportsRepository();
	}
};
