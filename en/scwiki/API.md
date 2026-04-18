# SearchCarefully API

**Written for SearchCarefully version X.X.X**

## Overview

SearchCarefully provides an API that allows other mods to integrate and customize search behavior.

## Adding Dependency

In your `build.gradle` or `mods.toml`, add a dependency on SearchCarefully.

## API Usage

### Getting Search Time

```java
import com.searchcarefully.api.SearchCarefullyAPI;

// Get the API instance
SearchCarefullyAPI api = SearchCarefullyAPI.getInstance();

// Get search time for a specific block
int searchTime = api.getSearchTime(Block block, World world);

// Get search time for a specific loot table
int searchTime = api.getSearchTime(ResourceLocation lootTable);
```

### Custom Search Handlers

You can register custom search handlers:

```java
import com.searchcarefully.api.handlers.SearchHandler;

public class MySearchHandler implements SearchHandler {
    @Override
    public int getSearchTime(ItemStack itemStack, World world) {
        // Return custom search time based on item
        return 100;
    }

    @Override
    public boolean shouldApply(ItemStack itemStack) {
        // Return true if this handler should be used for this item
        return itemStack.getItem() == Items.DIAMOND;
    }
}

// Register the handler
SearchCarefullyAPI.getInstance().registerHandler(new MySearchHandler());
```

### Events

SearchCarefully provides several events:

```java
// Subscribe to search start event
eventBus.addListener(SearchStartEvent.class, event -> {
    Player player = event.getPlayer();
    BlockPos pos = event.getChestPosition();
    // Handle event
});

// Subscribe to search complete event
eventBus.addListener(SearchCompleteEvent.class, event -> {
    Player player = event.getPlayer();
    List<ItemStack> items = event.getLoot();
    // Handle event
});
```

## Configuration API

```java
// Get current configuration
SearchCarefullyConfig config = SearchCarefullyAPI.getInstance().getConfig();

// Modify configuration programmatically
config.setSearchTimeMultiplier(1.5);
config.setEnabled(false);
```