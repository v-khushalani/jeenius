// src/components/SubscriptionPlans.tsx

const PLANS = {
  monthly: {
    name: 'Monthly',
    price: 299,
    duration: '1 month',
    popular: false
  },
  quarterly: {
    name: 'Quarterly',
    price: 799,
    duration: '3 months',
    popular: true,
    savings: '₹100'
  },
  yearly: {
    name: 'Yearly',
    price: 2499,
    duration: '12 months',
    popular: false,
    savings: '₹1000+'
  }
};

const SubscriptionPlans = ({ onSelectPlan }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 p-6">
      {Object.entries(PLANS).map(([key, plan]) => (
        <div
          key={key}
          className={`border rounded-xl p-6 ${
            plan.popular ? 'border-primary border-2 shadow-lg' : 'border-gray-200'
          }`}
        >
          {plan.popular && (
            <div className="bg-primary text-white text-sm px-3 py-1 rounded-full inline-block mb-4">
              Most Popular
            </div>
          )}
          
          <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
          <div className="mb-4">
            <span className="text-4xl font-bold">₹{plan.price}</span>
            <span className="text-gray-500">/{plan.duration}</span>
          </div>
          
          {plan.savings && (
            <p className="text-green-600 font-medium mb-4">Save {plan.savings}</p>
          )}
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-center">
              <span className="mr-2">✅</span> Unlimited Chapters
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span> Unlimited Questions
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span> AI Doubt Solving
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span> Personalized Study Plan
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span> Progress Analytics
            </li>
          </ul>
          
          <button
            onClick={() => onSelectPlan(key, plan.price)}
            className={`w-full py-3 rounded-lg font-bold ${
              plan.popular
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Choose Plan
          </button>
        </div>
      ))}
    </div>
  );
};
