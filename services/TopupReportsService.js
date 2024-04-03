const TopupReportsRepository = require("../repository/TopupReportsRepository");
const Crypto = require("../utils/Crypto");

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

		const newResult = result.map((data) => {
			return {
				...data,
				name: Crypto.Decrypt(data.name),
				mobile_number: Crypto.Decrypt(data.mobile_number),
				reference_no: "U" + String(data.reference_no).padStart(10, "0"),
			};
		});

		return newResult;
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
