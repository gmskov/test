import { AccessControlProvider } from '@pankod/refine-core'
import { newEnforcer } from 'casbin'
import { adapter, model } from './accessControl'

export const accessControlProvider: AccessControlProvider = {
  can: async ({ action, params, resource }) => {
    const enforcer = await newEnforcer(model, adapter);
    const role: string | null = localStorage.getItem('role');

    if (
      action === "delete" ||
      action === "edit" ||
      action === "show"
    ) {
      return Promise.resolve({
        can: await enforcer.enforce(
          role,
          `${resource}/${params?.id}`,
          action,
        ),
      });
    }
    if (action === "field") {
      return Promise.resolve({
        can: await enforcer.enforce(
          role,
          `${resource}/${params?.field}`,
          action,
        ),
      });
    }
    return Promise.resolve({
      can: await enforcer.enforce(role, resource, action),
    });
  },
};
