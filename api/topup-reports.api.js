const TopupReportsService = require("../services/TopupReportsService");

// middleware
const TokenMiddleware = require("../middlewares/TokenMiddleware");
const {
	ROLES,
	RoleManagementMiddleware,
} = require("../middlewares/RoleManagementMiddleware");

// Utitilities
const { HttpForbidden } = require("../utils/HttpError");
const logger = require("../config/winston");

/**
 * @param {import('express').Express} app
 */
module.exports = (app) => {
	const service = new TopupReportsService();
	const tokenMiddleware = new TokenMiddleware();
	const roleMiddleware = new RoleManagementMiddleware();

	app.get(
		"/admin_reports/api/v1/reports/sales/topup",
		[
			tokenMiddleware.AccessTokenVerifier(),
			roleMiddleware.CheckRole(ROLES.CPO_OWNER),
		],
		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 */
		async (req, res) => {
			try {
				if (req.role !== "CPO_OWNER") throw new HttpForbidden("Forbidden", []);

				const result = await service.GetTopupSales(req.id);

				return res
					.status(200)
					.json({ status: 200, data: result, message: "Success" });
			} catch (err) {
				logger.error({ GET_RFID_USERS_API_ERROR: { message: err.message } });

				logger.error(err);

				return res.status(err.status || 500).json({
					status: err.status || 500,
					data: err.data || [],
					message: err.message || "Internal Server Error",
				});
			}
		}
	);

	app.get(
		"/admin_reports/api/v1/reports/sales/topup/summary",
		[
			tokenMiddleware.AccessTokenVerifier(),
			roleMiddleware.CheckRole(ROLES.CPO_OWNER),
		],
		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 */
		async (req, res) => {
			try {
				if (req.role !== "CPO_OWNER") throw new HttpForbidden("Forbidden", []);

				const result = await service.GetTopupSalesSummary(req.id);

				return res
					.status(200)
					.json({ status: 200, data: result, message: "Success" });
			} catch (err) {
				logger.error({ GET_RFID_USERS_API_ERROR: { message: err.message } });

				logger.error(err);

				return res.status(err.status || 500).json({
					status: err.status || 500,
					data: err.data || [],
					message: err.message || "Internal Server Error",
				});
			}
		}
	);
};
