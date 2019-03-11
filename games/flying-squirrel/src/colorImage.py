from PIL import Image

OLD_PATH = r'../imgs/ground_mountain1.png'
NEW_PATH = r'../imgs/ground_mountain1_C1.png'

#OLD_PATH = r'../imgs/ground_hill3.png'
#NEW_PATH = r'../imgs/ground_hill3_C8.png'

#OLD_PATH = r'../imgs/sky_sun.png'
#NEW_PATH = r'../imgs/sky_sun_C8.png'

#OLD_PATH = r'../imgs/sky_star.png'
#NEW_PATH = r'../imgs/sky_star_C8.png'

#OLD_PATH = r'../imgs/sky_moon.png'
#NEW_PATH = r'../imgs/sky_moon_C8.png'

#OLD_PATH = r'../imgs/tree_ball.png'
#NEW_PATH = r'../imgs/tree_ball_C8.png'

#OLD_PATH = r'../imgs/tree_bush.png'
#NEW_PATH = r'../imgs/tree_bush_C8.png'

#OLD_PATH = r'../imgs/tree_triangle.png'
#NEW_PATH = r'../imgs/tree_triangle_C8.png'

# OLD_PATH = r'../imgs/cloud3.png'
# NEW_PATH = r'../imgs/cloud3_C8.png'

# Original Colors
R_OLD, G_OLD, B_OLD = (255, 255, 255)
R_OLD2, G_OLD2, B_OLD2 = (204, 204, 204)

# Original Cloud Colors
# R_OLD, G_OLD, B_OLD = (226, 226, 226)
# R_OLD2, G_OLD2, B_OLD2 = (130, 130, 130)

# Cloud Colors
#R_NEW, G_NEW, B_NEW = (255,255,255)  #Color 1
#R_NEW, G_NEW, B_NEW = (247,120,37) # Color 2
#R_NEW, G_NEW, B_NEW = (190,165,68) # Color 3
#R_NEW, G_NEW, B_NEW = (57,68,110)  # Color 4
#R_NEW, G_NEW, B_NEW = (149,152,173) # Color 5
#R_NEW, G_NEW, B_NEW = (122,110,124) # Color 6
#R_NEW, G_NEW, B_NEW = (110,100,137) # Color 7
# R_NEW, G_NEW, B_NEW = (192,89,108) # Color 8


# Tree Colors
#R_NEW, G_NEW, B_NEW = (171,155,158)  #Color 1
#R_NEW, G_NEW, B_NEW = (96,185,154) # Color 2
#R_NEW, G_NEW, B_NEW = (182,73,96) # Color 3
#R_NEW, G_NEW, B_NEW = (196,1,1) # Color 4
#R_NEW, G_NEW, B_NEW = (128,147,109) # Color 5
#R_NEW, G_NEW, B_NEW = (183,173,182) # Color 6
#R_NEW, G_NEW, B_NEW = (176,83,114) # Color 7
#R_NEW, G_NEW, B_NEW = (159,137,100) # Color 8

# Sun/Star Colors
#R_NEW, G_NEW, B_NEW = (210,142,181)  #Color 1
#R_NEW, G_NEW, B_NEW = (211,206,61) # Color 2
#R_NEW, G_NEW, B_NEW = (246,114,114) # Color 3
#R_NEW, G_NEW, B_NEW = (108,152,164) # Color 4
#R_NEW, G_NEW, B_NEW = (250,235,208) # Color 5
#R_NEW, G_NEW, B_NEW = (224,141,40) # Color 6
#R_NEW, G_NEW, B_NEW = (173,143,177) # Color 7
#R_NEW, G_NEW, B_NEW = (235,216,212) # Color 8

# Mountain Colors
R_NEW, G_NEW, B_NEW = (122, 82, 108)  #Color 1
#R_NEW, G_NEW, B_NEW = (241,239,165) # Color 2
#R_NEW, G_NEW, B_NEW = (249,40,94) # Color 3
#R_NEW, G_NEW, B_NEW = (236,220,205) # Color 4
#R_NEW, G_NEW, B_NEW = (212,164,74) # Color 5
#R_NEW, G_NEW, B_NEW = (198,192,14) # Color 6
#R_NEW, G_NEW, B_NEW = (255,199,197) # Color 7
#R_NEW, G_NEW, B_NEW = (196,191,169) # Color 8

R_NEW2, G_NEW2, B_NEW2 = (R_NEW - 50, G_NEW - 50, B_NEW - 50)

im = Image.open(OLD_PATH)
pixels = im.load()

width, height = im.size
print(im.size)
for x in range(width):
    for y in range(height):
        r, g, b, a = pixels[x, y]
        if (r, g, b) == (R_OLD, G_OLD, B_OLD):
            pixels[x, y] = (R_NEW, G_NEW, B_NEW, a)
        elif (r, g, b) == (R_OLD2, G_OLD2, B_OLD2):
            pixels[x, y] = (R_NEW2, G_NEW2, B_NEW2, a)
im.save(NEW_PATH)
