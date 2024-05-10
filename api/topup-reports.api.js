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
		"/merchant_reports/api/v1/reports/sales/topup",
		[
			tokenMiddleware.AccessTokenVerifier(),
			roleMiddleware.CheckRole(ROLES.CPO_OWNER),
		],
		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 */
		async (req, res, next) => {
			try {
				logger.info({
					GET_SALES_REQUEST: {
						data: {
							id: req.id,
						},
						message: "SUCCESS",
					},
				});

				if (req.role !== "CPO_OWNER") throw new HttpForbidden("Forbidden", []);

				const result = await service.GetTopupSales(req.id);

				logger.info({
					GET_SALES_RESPONSE: {
						message: "SUCCESS",
					},
				});

				return res
					.status(200)
					.json({ status: 200, data: result, message: "Success" });
			} catch (err) {
				req.error_name = "GET_SALES_ERROR";
				next(err);
			}
		}
	);

	app.get(
		"/merchant_reports/api/v1/reports/sales/topup/summary",
		[
			tokenMiddleware.AccessTokenVerifier(),
			roleMiddleware.CheckRole(ROLES.CPO_OWNER),
		],
		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 */
		async (req, res, next) => {
			try {
				logger.info({
					GET_TOPUP_SALES_SUMMARY_REQUEST: {
						data: {
							id: req.id,
						},
						message: "SUCCESS",
					},
				});

				if (req.role !== "CPO_OWNER") throw new HttpForbidden("Forbidden", []);

				const result = await service.GetTopupSalesSummary(req.id);

				logger.info({
					GET_TOPUP_SALES_SUMMARY_RESPONSE: {
						message: "SUCCESS",
					},
				});

				return res
					.status(200)
					.json({ status: 200, data: result, message: "Success" });
			} catch (err) {
				req.error_name = "GET_TOPUP_SALES_SUMMARY_ERROR";
				next(err);
			}
		}
	);

	app.use((err, req, res, next) => {
		logger.error({
			API_REQUEST_ERROR: {
				error_name: req.error_name || "UNKNOWN_ERROR",
				message: err.message,
				stack: err.stack.replace(/\\/g, "/"), // Include stack trace for debugging
				request: {
					method: req.method,
					url: req.url,
					code: err.status || 500,
				},
				data: err.data || [],
			},
		});

		const status = err.status || 500;
		const message = err.message || "Internal Server Error";

		res.status(status).json({
			status,
			data: err.data || [],
			message,
		});
	});
};
