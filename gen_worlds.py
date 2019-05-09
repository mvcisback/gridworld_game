from gridworld_vis.gridworld import gridworld


def main():
    def tile2classes(x, y):
        if x <= 5 and y == 4:
            return "water"
        elif (x, y) == (7, 0):
            return "recharge"
        elif (x, y) == (3, 1):
            return "dry"
        elif (2 <= x <= 4) and (y in (1, 4)):
            return "lava"

        return "normal"

    dwg = gridworld(n=8, tile2classes=tile2classes, actions=[])
    dwg.saveas("world1.svg", pretty=True)


if __name__ == "__main__":
    main()
