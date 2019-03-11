from PIL import Image

OLD_PATH = r'../imgs/Large Images/downArrow.png'
NEW_PATH = r'../imgs/downArrow.png'
im = Image.open(OLD_PATH)
pixels = im.load()
width, height = im.size
im = im.resize((int(width*0.03), int(height*0.03)), Image.ANTIALIAS)
im.save(NEW_PATH)

OLD_PATH = r'../imgs/Large Images/acorn2.png'
NEW_PATH = r'../imgs/acorn2.png'
im = Image.open(OLD_PATH)
pixels = im.load()
width, height = im.size
im = im.resize((int(width*0.3), int(height*0.3)), Image.ANTIALIAS)
im.save(NEW_PATH)

OLD_PATH = r'../imgs/Large Images/Snake.png'
NEW_PATH = r'../imgs/Snake.png'
im = Image.open(OLD_PATH)
pixels = im.load()
width, height = im.size
im = im.resize((int(width*0.21), int(height*0.21)), Image.ANTIALIAS)
im.save(NEW_PATH)

OLD_PATH = r'../imgs/Large Images/cape.png'
NEW_PATH = r'../imgs/cape.png'
im = Image.open(OLD_PATH)
pixels = im.load()
width, height = im.size
im = im.resize((int(width*0.115), int(height*0.115)), Image.ANTIALIAS)
im.save(NEW_PATH)

OLD_PATH = r'../imgs/Large Images/rocket.png'
NEW_PATH = r'../imgs/rocket.png'
im = Image.open(OLD_PATH)
pixels = im.load()
width, height = im.size
im = im.resize((int(width*0.115), int(height*0.115)), Image.ANTIALIAS)
im.save(NEW_PATH)

for i in range(1,4):
    OLD_PATH = r'../imgs/Large Images/rocket_' + str(i) + '.png'
    NEW_PATH = r'../imgs/rocket_' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    im = im.resize((int(width*0.115), int(height*0.115)), Image.ANTIALIAS)
    im.save(NEW_PATH)

    OLD_PATH = r'../imgs/Large Images/cloud' + str(i) + '.png'
    NEW_PATH = r'../imgs/cloud' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    if i == 3:
        im = im.resize((int(width*0.8), int(height*0.8)), Image.ANTIALIAS)
    else:
        im = im.resize((int(width*0.5), int(height*0.5)), Image.ANTIALIAS)
    im.save(NEW_PATH)

for i in range(1,9):
    for j in range(1,4):
        OLD_PATH = r'../imgs/Large Images/ground_mountain' + str(j) + '_C' + str(i) + '.png'
        NEW_PATH = r'../imgs/ground_mountain' + str(j) + '_C' + str(i) + '.png'
        im = Image.open(OLD_PATH)
        pixels = im.load()
        width, height = im.size
        im = im.resize((int(width*0.09), int(height*0.09)), Image.ANTIALIAS)
        im.save(NEW_PATH)

        OLD_PATH = r'../imgs/Large Images/ground_hill' + str(j) + '_C' + str(i) + '.png'
        NEW_PATH = r'../imgs/ground_hill' + str(j) + '_C' + str(i) + '.png'
        im = Image.open(OLD_PATH)
        pixels = im.load()
        width, height = im.size
        im = im.resize((int(width*0.09), int(height*0.09)), Image.ANTIALIAS)
        im.save(NEW_PATH)

        OLD_PATH = r'../imgs/Large Images/cloud' + str(j) + '_C' + str(i) + '.png'
        NEW_PATH = r'../imgs/cloud' + str(j) + '_C' + str(i) + '.png'
        im = Image.open(OLD_PATH)
        pixels = im.load()
        width, height = im.size
        if j == 3:
            im = im.resize((int(width*0.8), int(height*0.8)), Image.ANTIALIAS)
        else:
            im = im.resize((int(width*0.5), int(height*0.5)), Image.ANTIALIAS)
        im.save(NEW_PATH)

    OLD_PATH = r'../imgs/Large Images/sky_sun_C' + str(i) + '.png'
    NEW_PATH = r'../imgs/sky_sun_C' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    im = im.resize((int(width*0.04), int(height*0.04)), Image.ANTIALIAS)
    im.save(NEW_PATH)

    OLD_PATH = r'../imgs/Large Images/sky_star_C' + str(i) + '.png'
    NEW_PATH = r'../imgs/sky_star_C' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    im = im.resize((int(width*0.015), int(height*0.015)), Image.ANTIALIAS)
    im.save(NEW_PATH)

    OLD_PATH = r'../imgs/Large Images/sky_moon_C' + str(i) + '.png'
    NEW_PATH = r'../imgs/sky_moon_C' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    im = im.resize((int(width*0.04), int(height*0.04)), Image.ANTIALIAS)
    im.save(NEW_PATH)

    OLD_PATH = r'../imgs/Large Images/tree_ball_C' + str(i) + '.png'
    NEW_PATH = r'../imgs/tree_ball_C' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    im = im.resize((int(width*0.05), int(height*0.05)), Image.ANTIALIAS)
    im.save(NEW_PATH)

    OLD_PATH = r'../imgs/Large Images/tree_bush_C' + str(i) + '.png'
    NEW_PATH = r'../imgs/tree_bush_C' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    im = im.resize((int(width*0.05), int(height*0.05)), Image.ANTIALIAS)
    im.save(NEW_PATH)

    OLD_PATH = r'../imgs/Large Images/tree_triangle_C' + str(i) + '.png'
    NEW_PATH = r'../imgs/tree_triangle_C' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    im = im.resize((int(width*0.05), int(height*0.05)), Image.ANTIALIAS)
    im.save(NEW_PATH)
