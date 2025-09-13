// Context for Saathi assistant
const DRIVER_CONTEXT = {
  profile: {
    name: "Ramesh Kumar",
    city: "Bangalore",
    joined_date: "2023-08-15",
    vehicle: { type: "Bike", model: "Honda Shine", registration: "KA-01-AB-1234" },
    rating: 4.78,
    phone: "+91-98xxxxxx45"
  },
  earnings: {
    "2025-09-12": {
      total_earnings: 1800,
      expenses: { fuel: 300, commission: 100, toll: 50 },
      net_earnings: 1350,
      completed_trips: 12,
      cash_collected: 900,
      wallet_balance: 450
    },
    "2025-09-13": {
      total_earnings: 2150,
      expenses: { fuel: 350, commission: 110, parking: 30 },
      net_earnings: 1660,
      completed_trips: 15,
      cash_collected: 1200,
      wallet_balance: 520
    },
    "2025-09-14": {
      total_earnings: 1620,
      expenses: { fuel: 280, commission: 95 },
      net_earnings: 1245,
      completed_trips: 11,
      cash_collected: 700,
      wallet_balance: 420
    }
  },
  penalties: [
    { id: "PEN_01", reason: "Late Delivery", amount: 50, details: "30 min delay" },
    { id: "PEN_02", reason: "Helmet Not Worn", amount: 100, details: "Warned by traffic cam" }
  ],
  rewards: [
    { id: "REW_01", reason: "Weekly Target Achieved", amount: 200, details: "Completed 60 trips this week" },
    { id: "REW_02", reason: "5-Star Streak", amount: 150, details: "10 consecutive 5-star ratings" }
  ],
  shifts: [
    { date: "2025-09-12", start: "08:00", end: "18:00" },
    { date: "2025-09-13", start: "09:00", end: "17:00" }
  ],
  goals: {
    weekly_trips_target: 70,
    weekly_trips_done: 33,
    weekly_earnings_target: 9000
  }
};

export default DRIVER_CONTEXT;
