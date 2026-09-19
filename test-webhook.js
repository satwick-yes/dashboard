const payload = {
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "12345",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15551943222",
              "phone_number_id": "1289304197605949"
            },
            "contacts": [
              {
                "profile": {
                  "name": "Satwick"
                },
                "wa_id": "919876543210"
              }
            ],
            "messages": [
              {
                "from": "919876543210",
                "id": "wamid.HBgMOTE5ODc2NTQzMjEwFQIAEhgUM0E2NDFGQTgwQjY0RjU2QTlDMUUA",
                "timestamp": "1726725350",
                "text": {
                  "body": "Hello from testing script!"
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
};

fetch("http://localhost:3000/api/whatsapp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
}).then(res => res.text()).then(console.log).catch(console.error);
