package com.shark.gametutorial;

import net.minecraft.client.gui.Gui;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.client.gui.screens.inventory.ContainerScreen;
import net.minecraft.client.renderer.entity.ItemRenderer;
import net.minecraft.world.inventory.ChestMenu;
import net.minecraft.world.inventory.MenuType;
import net.minecraft.world.level.Level;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.entity.player.Inventory;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.network.chat.Component;
import net.minecraft.client.gui.screens.inventory.AbstractContainerScreen;
import net.minecraft.client.Minecraft;


import java.util.HashMap;

import com.mojang.blaze3d.vertex.PoseStack;
import com.mojang.blaze3d.systems.RenderSystem;

public class gui extends ChestMenu {


    public gui(Component text) {
        super(
                MenuType.GENERIC_9x1,
                1,
                new Inventory(Minecraft.getInstance().player),
                1
        );


    }



    //private static final ResourceLocation texture = new ResourceLocation("D:\\Projects\\Misc\\util\\mods\\createsharkthing\\launcher\\assets\\logo.png");

}
