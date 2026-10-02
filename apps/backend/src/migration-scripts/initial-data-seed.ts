import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  const countries = ["us"];

  logger.info("Seeding store data...");
  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Default Sales Channel",
          description: "Created by Medusa",
        },
      ],
    },
  });

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Default Publishable API Key",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  });

  const {
    result: [store],
  } = await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "Hub & Hue",
          supported_currencies: [
            {
              currency_code: "usd",
              is_default: true,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  });

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "United States",
          currency_code: "usd",
          countries,
          payment_providers: [
            "pp_system_default",
            ...(process.env.STRIPE_API_KEY ? ["pp_stripe_stripe"] : []),
          ],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Print Shop",
          address: {
            country_code: "US",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  // This is created by a migration script in core.
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfileResult[0];

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Print Shop delivery",
    type: "shipping",
    service_zones: [
      {
        name: "United States",
        geo_zones: countries.map((country_code) => ({
          country_code,
          type: "country" as const,
        })),
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Printed to order, ships in 3-5 business days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 8,
          },
          {
            region_id: region.id,
            amount: 8,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Priority print queue, ships in 1-2 business days.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 18,
          },
          {
            region_id: region.id,
            amount: 18,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Center Caps",
          is_active: true,
        },
        {
          name: "Lug Nut Covers",
          is_active: true,
        },
      ],
    },
  });
  const categoryId = (name: string) =>
    categoryResult.find((cat) => cat.name === name)!.id;

  // Placeholder catalog: fitments, colors, prices and copy are starting points
  // to be replaced with measured, test-fitted parts.
  const fitments = [
    { label: "Ford Super Duty (8x170)", sku: "F170" },
    { label: "Ram 2500/3500 (8x165.1)", sku: "R165" },
    { label: "GM 2500HD/3500HD (8x180)", sku: "G180" },
  ];
  const colors = [
    { label: "Matte Black", sku: "BLK" },
    { label: "Safety Orange", sku: "ORG" },
    { label: "Signal Red", sku: "RED" },
  ];

  const { result: productOptionsResult } = await createProductOptionsWorkflow(
    container
  ).run({
    input: {
      product_options: [
        {
          title: "Fitment",
          values: fitments.map((f) => f.label),
        },
        {
          title: "Color",
          values: colors.map((c) => c.label),
        },
      ],
    },
  });
  const fitmentOption = productOptionsResult.find(
    (o) => o.title === "Fitment"
  )!;
  const colorOption = productOptionsResult.find((o) => o.title === "Color")!;

  const fitmentColorVariants = (skuPrefix: string, amount: number) =>
    fitments.flatMap((fitment) =>
      colors.map((color) => ({
        title: `${fitment.label} / ${color.label}`,
        sku: `${skuPrefix}-${fitment.sku}-${color.sku}`,
        options: {
          Fitment: fitment.label,
          Color: color.label,
        },
        prices: [
          {
            amount,
            currency_code: "usd",
          },
        ],
      }))
    );

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "HD Center Cap",
          category_ids: [categoryId("Center Caps")],
          description:
            "3D-printed replacement center cap for 8-lug heavy-duty pickups. Sold individually. Pick your truck's fitment and a color.",
          handle: "hd-center-cap",
          weight: 180,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: fitmentOption.id }, { id: colorOption.id }],
          variants: fitmentColorVariants("CAP", 24),
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "HD Center Cap 4-Pack",
          category_ids: [categoryId("Center Caps")],
          description:
            "A full set of four 3D-printed center caps for 8-lug heavy-duty pickups, printed together so the color matches across all four wheels.",
          handle: "hd-center-cap-4-pack",
          weight: 720,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: fitmentOption.id }, { id: colorOption.id }],
          variants: fitmentColorVariants("CAP4", 79),
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "Lug Nut Cover Set (32)",
          category_ids: [categoryId("Lug Nut Covers")],
          description:
            "32 push-on 3D-printed lug nut covers, enough for all four wheels of an 8-lug truck.",
          handle: "lug-nut-cover-set",
          weight: 260,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: colorOption.id }],
          variants: colors.map((color) => ({
            title: color.label,
            sku: `LUG32-${color.sku}`,
            options: {
              Color: color.label,
            },
            prices: [
              {
                amount: 29,
                currency_code: "usd",
              },
            ],
          })),
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 100,
        inventory_item_id: item.id,
      })),
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
