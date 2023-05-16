package com.shark.gametutorial.items;


import net.minecraft.world.item.CreativeModeTab;
import com.shark.gametutorial.items.ItemData;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.Item.Properties;
import java.util.*;

public class Items {


        public List<ItemData> Items() {

                Hashtable<String, ItemData> dict = new Hashtable<String, ItemData>();
                Hashtable<String, Properties> properties = new Hashtable<String, Properties>();


                List<String> ItemList = Arrays.asList("Gadget");


                properties.put("Gadget", new Properties().tab(CreativeModeTab.TAB_MISC));

                ItemList.forEach((x) -> {
                        dict.put(x, new ItemData(x, new Gadget(properties.get(x)).asItem()));
                });


                List<ItemData> values = dict.values().stream().toList();
                return values;




}
}

