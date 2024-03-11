const TopupReportsRepository = require("../repository/TopupReportsRepository");

/**
 * @class Services for retrieving topup sales report.
 */
module.exports = class TopupReportsService {
	#repository;

	constructor() {
		this.#repository = new TopupReportsRepository();
	}

	/**
	 * Retrieve topup sales by ID of the CPO.
	 * @async
	 * @method
	 * @param {number} userID ID of the CPO
	 *
	 * @returns {Promise<Array>}
	 */
	async GetTopupSales(userID) {
		const result = await this.#repository.GetTopupSales(userID);

		return result;
	}

	/**
	 * Retrieve total topup sales, and total void topups.
	 * @async
	 * @method
	 * @param {number} userID ID of the CPO
	 *
	 * @returns {Promise<Array>}
	 */
	async GetTopupSalesSummary(userID) {
		const result = await this.#repository.GetTopupSalesSummary(userID);

		return result[0];
	}
};
