/**
 * Custom hook to get user roles
 * @return {Array.<{key: string, msgKey: string, assignedRole:boolean}>}
 */
export const selectRolesData = ({ User }) => {
  const rolesList = (User.data.user.rolesList || []).map(
    (savedRole) => savedRolesToKeysMap[savedRole] || savedRole
  );
  const unassignedDefaultRoles = DEFAULT_ROLES.filter(
    (roleKey) => !rolesList.includes(roleKey)
  );

  // special case for partner role
  const partnerId = User.data.user.partner_id;
  const partnerGroupId = User.data.user.partner_group_id;
  ROLES[PARTNER_ROLE_KEY].properties.partnerId = User.data.user.partner_id;
  ROLES[PARTNER_ROLE_KEY].properties.partnerGroupId =
      User.data.user.partner_group_id;

  return unassignedDefaultRoles
    .map((roleKey) => ({
      key: roleKey,
      msgKey: ROLES[roleKey].msgKey,
      assignedRole: false,
      properties: ROLES[roleKey].properties,
    }))
    .concat(
      rolesList.map((roleKey) => ({
        key: roleKey,
        msgKey: ROLES[roleKey].msgKey,
        assignedRole: true,
        properties: ROLES[roleKey].properties,
      }))
    );
};