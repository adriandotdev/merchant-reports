const mysql = require("../database/mysql");

module.exports = class TopupReportsRepository {
	GetTopupSales(userID) {
		const query = `
        SELECT 
            cpo_owners.cpo_owner_name,
            rfid_cards.rfid_card_tag,
            user_drivers.name,
            user_drivers.mobile_number,
            topup_logs.id AS reference_no,
            topup_logs.amount,
            topup_logs.type,
            topup_logs.payment_type,
            topup_logs.payment_status,
            topup_logs.date_created
        FROM cpo_owners
        INNER JOIN topup_logs
        ON cpo_owners.id = topup_logs.cpo_owner_id
        INNER JOIN users
        ON users.id = topup_logs.user_id
        INNER JOIN user_drivers
        ON users.id = user_drivers.user_id
        INNER JOIN rfid_cards
        ON user_drivers.id = rfid_cards.user_driver_id
        WHERE topup_logs.user_type = 'USER_DRIVER' AND topup_logs.cpo_owner_id = (
            SELECT id FROM cpo_owners
            WHERE user_id = ?
        )
        ORDER BY date_created DESC`;
		return new Promise((resolve, reject) => {
			mysql.query(query, [userID], (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	}

	GetTopupSalesSummary(userID) {
		const query = ` 
            SELECT 
            *,
            ABS((total_topups - total_voids)) AS total_user_topup_sales
        FROM (
            SELECT 
                SUM(CASE WHEN type = 'TOPUP' AND payment_status = 'success' THEN amount ELSE 0 END) AS total_topups,
                SUM(CASE WHEN type = 'VOID' AND payment_status = 'success' THEN amount ELSE 0 END) AS total_voids
            FROM topup_logs
            WHERE cpo_owner_id = (
                SELECT id FROM cpo_owners
                WHERE user_id = ?
            )
        ) AS topup_summary`;
		return new Promise((resolve, reject) => {
			mysql.query(query, [userID], (err, result) => {
				if (err) {
					reject(err);
				}

				resolve(result);
			});
		});
	}
};
