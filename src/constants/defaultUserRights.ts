export const managerDefaultRights = {
  taskRights: {
    create: true,
    edit: true,
    delete: true,
    view: "all tasks",
    markTasksAs: {
      complete: true,
      ignoreTracking: true,
      notRequired: true
    }
  },
  clientRights: {
    create: true,
    edit: true,
    inactive_delete: false,
    importClient: true,
  },
  tagRights: {
    create: true,
    edit: true,
    inactive_delete: false
  },
  statusRights: {
    create: true,
    edit: true,
    inactive_delete: false
  },
  userRights: {
    add: false,
    edit: false,
    inactive_delete: false,
  },
  reciptsAndPayments: true,
  registerInAndOut: true,
};

export const employeeDefaultRights = {
  taskRights: {
    create: true,
    edit: true,
    delete: false,
    view: "him or her",
    markTasksAs: {
      complete: true,
      ignoreTracking: true,
      notRequired: true
    }
  },
  clientRights: {
    create: true,
    edit: true,
    inactive_delete: false,
    importClient: true,
  },
  tagRights: {
    create: true,
    edit: true,
    inactive_delete: false
  },
  statusRights: {
    create: true,
    edit: true,
    inactive_delete: false
  },
  userRights: {
    add: false,
    edit: false,
    inactive_delete: false
  },
  reciptsAndPayments: true,
  registerInAndOut: true,
};

export const adminRights = {
  taskRights: {
      create: true,
      edit: true,
      delete: true,
      view: "all tasks",
      markTasksAs: {
        complete: true,
        ignoreTracking: true,
        notRequired: true
    }
    },

    clientRights: {
      create: true,
      edit: true,
      inactive_delete: true,
      importClient: true
    },

    tagRights: {
      create: true,
      edit: true,
      inactive_delete: true
    },

    statusRights: {
      create: true,
      edit: true,
      inactive_delete: true
    },

    userRights: {
      add: true,
      edit: true,
      inactive_delete: true
    },
    
    reciptsAndPayments: true,
    registerInAndOut: true,
}


export const userRights = [
  {
    id: "clientRights",
    name: "Client",
    options: [
      {
        id: "clientRights-create",
        name: "Create",
        action: "create"
      },
      {
        id: "clientRights-edit",
        name: "Edit",
        action: "edit"
      },
      {
        id: "clientRights-delete",
        name: "Delete/Inactive",
        action: "inactive_delete"
      },
      {
        id: "clientRights-import",
        name: "Import",
        action: "importClient"
      }
    ]
  },

  {
    id: "tagRights",
    name: "Tag",
    options: [
      {
        id: "tagRights-create",
        name: "Create",
        action: "create"
      },
      {
        id: "tagRights-edit",
        name: "Edit",
        action: "edit"
      },
      {
        id: "tagRights-delete",
        name: "Delete/Inactive",
        action: "inactive_delete"
      },
    ]
  },

  {
    id: "statusRights",
    name: "Status",
    options: [
      {
        id: "statusRights-create",
        name: "Create",
        action: "create"
      },
      {
        id: "statusRights-edit",
        name: "Edit",
        action: "edit"
      },
      {
        id: "statusRights-delete",
        name: "Delete/Inactive",
        action: "inactive_delete"
      },
    ]
  },

  {
    id: "userRights",
    name: "Users",
    options: [
      {
        id: "userRights-create",
        name: "Create",
        action: "add"
      },
      {
        id: "userRights-edit",
        name: "Edit",
        action: "edit"
      },
      {
        id: "userRights-delete",
        name: "Delete/Inactive",
        action: "inactive_delete"
      },
    ]
  }
]
