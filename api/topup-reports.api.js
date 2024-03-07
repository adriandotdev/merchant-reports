const TopupReportsService = require("../services/TopupReportsService");

// middleware
const { AccessTokenVerifier } = require("../middlewares/TokenMiddleware");

// Utitilities
const { HttpForbidden } = require("../utils/HttpError");
const logger = require("../config/winston");

module.exports = (app) => {
	const service = new TopupReportsService();

	app.get(
		"/admin_reports/api/v1/reports/sales/topup",
		[AccessTokenVerifier],
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
		[AccessTokenVerifier],
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
