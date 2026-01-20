// Utility to get current organization ID from localStorage
// This matches how the select page stores it

export const getCurrentOrganizationId = (): string => {
  // Try multiple possible keys where org ID might be stored
  const orgId = 
    localStorage.getItem('selectedOrgId') || 
    localStorage.getItem('selectedOrganizationId') ||
    localStorage.getItem('currentOrganizationId');
  
  // If still not found, try to get first org from organizations array
  if (!orgId) {
    const orgsString = localStorage.getItem('organizations');
    if (orgsString) {
      try {
        const orgs = JSON.parse(orgsString);
        if (Array.isArray(orgs) && orgs.length > 0) {
          const firstOrgId = orgs[0].id;
          // Save it for next time
          setCurrentOrganizationId(firstOrgId);
          return firstOrgId;
        }
      } catch (e) {
        console.error('Failed to parse organizations:', e);
      }
    }
    
    throw new Error('No organization selected. Please select an organization first.');
  }
  
  return orgId;
};

// Helper to set organization ID (called from select page)
export const setCurrentOrganizationId = (organizationId: string): void => {
  localStorage.setItem('selectedOrgId', organizationId);
  localStorage.setItem('selectedOrganizationId', organizationId); // backup key
  localStorage.setItem('currentOrganizationId', organizationId); // another backup
};

// Helper to clear organization ID (on logout)
export const clearCurrentOrganizationId = (): void => {
  localStorage.removeItem('selectedOrgId');
  localStorage.removeItem('selectedOrganizationId');
  localStorage.removeItem('currentOrganizationId');
};

// Helper to get all organizations
export const getOrganizations = (): any[] => {
  const orgsString = localStorage.getItem('organizations');
  if (!orgsString) return [];
  
  try {
    return JSON.parse(orgsString);
  } catch (e) {
    console.error('Failed to parse organizations:', e);
    return [];
  }
};