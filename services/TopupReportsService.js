const TopupReportsRepository = require("../repository/TopupReportsRepository");

module.exports = class TopupReportsService {
	#repository;

	constructor() {
		this.#repository = new TopupReportsRepository();
	}

	async GetTopupSales(userID) {
		const result = await this.#repository.GetTopupSales(userID);

		return result;
	}

	async GetTopupSalesSummary(userID) {
		const result = await this.#repository.GetTopupSalesSummary(userID);

		return result[0];
	}
};
