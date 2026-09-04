export enum CompetitionType {
    DomesticLeague = 1,
    DomesticCup = 2,
    Continental = 3,
    Intercontinental = 4,
    Playoffs = 5,
    Youth = 6,
}

export enum PlayerPosition {
    Goalkeeper = 1,
    Defender = 2,
    Midfielder = 3,
    Forward = 4,
}

export enum PlayerSubPosition {
    // Goalkeeper
    GK = 1,
    CB = 10,
    LB = 11,
    RB = 12,
    LWB = 13,
    RWB = 14,

    // Midfielders
    DM = 19,
    CDM = 20,
    CM = 21,
    CAM = 22,
    LM = 23,
    RM = 24,
    LAM = 25,
    RAM = 26,
    // Forwards
    ST = 30,
    CF = 31,
    LW = 32,
    RW = 33,
}

export enum PlayerPreferredFoot {
    Unknown = 0,
    Right = 1,
    Left = 2,
    Both = 3,
    Bottom = 4,
}

export enum TransferType {
    Transfer = 0,
    Loan = 1,
    Free = 2,
    EndofLoan = 3,
    Promotion = 4,
    Retired = 5,
    Released = 6,
    Renewal = 7,
}

export enum TeamType {
    CLUB = 1,
    NATIONAL = 2,
    YOUTH_CLUB = 3,
    YOUTH_NATIONAL = 4,
}