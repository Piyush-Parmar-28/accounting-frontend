const SalesPlatformTypes = [
  {
    id: 1,
    name: "Amazon B2B",
    value: "Amazon_B2B",
    avatar: "/images/Amazon.jpg"
  },
  {
    id: 2,
    name: "Amazon B2C",
    value: "Amazon_B2C",
    avatar: "/images/Amazon.jpg"
  },
  {
    id: 3,
    name: "Flipkart",
    value: "Flipkart",
    avatar: "/images/Flipkart.jpeg"
  },
  {
    id: 4,
    name: "Sales",
    value: "Offline",
    icon: "offline"
  },
  {
    id: 5,
    name: "Sales - RCM, SEZ, Export",
    value: "Offline_Extended",
    icon: "offline"
  },
  {
    id: 6,
    name: "Meesho",
    value: "Meesho_Sales",
    icon: "/images/Meesho.png"
  }
];

const PurchasePlatformTypes = [
  {
    id: 1,
    name: "Purchases",
    value: "Offline",
    icon: "offline"
  },
  {
    id: 2,
    name: "Purchases - RCM, IMS, IMG",
    value: "Offline_Extended",
    icon: "offline"
  }
];

const OfflineExtendedPlatformTypes = [
  {
    id: 1,
    name: "Export With Payment",
    value: "EWP",
    icon: "offline"
  },
  {
    id: 2,
    name: "Export Without Payment",
    value: "EWOP",
    icon: "offline"
  },
  {
    id: 3,
    name: "SEZ With Payment",
    value: "SEZWP",
    icon: "offline"
  },
  {
    id: 4,
    name: "SEZ Without Payment",
    value: "SEZWOP",
    icon: "offline"
  },
  {
    id: 4,
    name: "Reverse Charge (RCM)",
    value: "RCM",
    icon: "offline"
  }
];

const ReturnsPlatformTypes = [
  { id: 1, name: "GSTR - 2A", value: "Gstr2A", icon: "offline" },
  { id: 1, name: "GSTR - 2B", value: "Gstr2B", icon: "offline" }
];

const convertValueToName = (val: string) => {
  let platformType = SalesPlatformTypes.find(type => type.value === val);
  let returnPlatformType = ReturnsPlatformTypes.find(
    type => type.value === val
  );
  let OfflineExtendedPlatformType = OfflineExtendedPlatformTypes.find(
    type => type.value === val
  );
  if (platformType) return platformType.name;
  else if (returnPlatformType) return returnPlatformType.name;
  else if (OfflineExtendedPlatformType) return OfflineExtendedPlatformType.name;
  else return false;
};

//login added for showing correct name in the Purchase import
const convertValueToNamePurchase = (val: string) => {
  let platformType = PurchasePlatformTypes.find(type => type.value === val);

  if (platformType) return platformType.name;
  else return false;
};

export const ImportTypes = {
  SalesPlatformTypes,
  PurchasePlatformTypes,
  ReturnsPlatformTypes,
  convertValueToName,
  convertValueToNamePurchase
};

export default ImportTypes;
