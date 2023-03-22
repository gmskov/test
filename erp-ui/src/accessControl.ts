import { newModel, StringAdapter } from "casbin";

export const model = newModel(`
[request_definition]
r = sub, obj, act
[policy_definition]
p = sub, obj, act, eft
[role_definition]
g = _, _
[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))
[matchers]
m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
`);

export const adapter = new StringAdapter(`
p, admin, persons, (list)|(create)
p, admin, employees, (list)|(create)
p, admin, invoices, (list)|(create)
p, admin, invoices/*, (show)|(edit)|(delete)
p, user, invoices, (show)|(list)
p, user, invoices/*, (show)
p, admin, admin, 
p, admin, users, (list)|(create)
p, admin, users/*, (edit)|(show)|(delete)
`);
