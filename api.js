(function() {
    const fetchContacts = async (phone) => {
        let data = await fetch('/api/v4/contacts');
        data = await data.json();
        const requiredContacts = data._embedded.contacts.filter((contact) => { // ищем контакт в массиве по условию
            const phoneValues = contact.custom_fields_values.find((field) => field.field_code === "PHONE")?.values || [];
            // находим поле "PHONE" и получаем все его значения
            return phoneValues.some((phoneValue) => phoneValue.value.includes(phone)); 
        });

        const result = requiredContacts.map((requiredContact) => ({
            id: requiredContact.responsible_user_id,
            name: requiredContact.name,
            link: requiredContact._links.self.href
        }));  
        
        return result;
    };
    const fetchLeads = async (contactId) => {
        let data = await fetch('/api/v4/leads');
        data = await data.json();

        const leads = data._embedded.leads.filter(lead => lead.responsible_user_id === contactId);

        const result = leads.map((lead) => ({
          id: lead.id,
          name: lead.name,
          link: lead._links.self.href
        }));
        return result;
    };
    window.crm = {
        contacts: {
            search: function(phone) {
                return fetchContacts(phone);
            }
        },
        leads: {
            search: function(contactId) {
                return fetchLeads(contactId);
            }
        }
    };
})();