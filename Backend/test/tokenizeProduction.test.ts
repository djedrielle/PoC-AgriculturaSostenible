import request from 'supertest';
import express from 'express';
import { router as productionRouter } from '../src/Business/Routes/tokenRoutes';

// Mock de todos los servicios y repositorios
jest.mock('../src/Business/Services/smartContractService', () => ({
  SmartContractService: jest.fn().mockImplementation(() => ({
    addSmartContract: jest.fn(),
    publishOnMarket: jest.fn()
  }))
}));

jest.mock('../src/Business/Services/productionService', () => ({
  ProductionService: jest.fn().mockImplementation(() => ({
    addProduction: jest.fn()
  }))
}));

jest.mock('../src/Business/Services/tokenService', () => ({
  TokenService: jest.fn().mockImplementation(() => ({
    createTokens: jest.fn()
  }))
}));

jest.mock('../src/Business/Services/marketService', () => ({
  MarketService: jest.fn().mockImplementation(() => ({
    publishOnMarket: jest.fn()
  }))
}));

jest.mock('../src/Persistence/Repos/smartContractRepository', () => ({
  SmartContractRepositoryPostgres: jest.fn().mockImplementation(() => ({
    createSmartContract: jest.fn()
  }))
}));

jest.mock('../src/Persistence/Repos/productionRepository', () => ({
  ProductionRepositoryPostgres: jest.fn().mockImplementation(() => ({
    createProduction: jest.fn()
  }))
}));

jest.mock('../src/Persistence/Repos/tokenRepository', () => ({
  TokenRepositoryPostgres: jest.fn().mockImplementation(() => ({
    createTokens: jest.fn()
  }))
}));

jest.mock('../src/Persistence/Repos/marketRepository', () => ({
  MarketRepositoryPostgres: jest.fn().mockImplementation(() => ({
    publishOnMarket: jest.fn()
  }))
}));

// Mock de los modelos
jest.mock('../src/Business/Models/smart_contract', () => ({
  SmartContract: jest.fn().mockImplementation((
    contract_id: string,
    contract_address: string,
    standard_implemented: string,
    initial_token_price: number,
    total_tokens: number,
    emition_date: string,
    active: boolean,
    contract_state: string
  ) => ({
    contract_id,
    contract_address,
    standard_implemented,
    initial_token_price,
    total_tokens,
    emition_date,
    active,
    contract_state
  }))
}));

jest.mock('../src/Business/Models/production', () => ({
  Production: jest.fn().mockImplementation((
    location: string,
    farmer_id: string,
    crop_type: string,
    crop_variety: string,
    est_harvest_date: string,
    amount: number,
    measure_unit: string,
    biologic_features: string,
    agro_conditions: string,
    agro_protocols: string,
    active: boolean,
    contract_id?: string
  ) => ({
    production_id: '',
    location,
    farmer_id,
    crop_type,
    crop_variety,
    est_harvest_date,
    amount,
    measure_unit,
    biologic_features,
    agro_conditions,
    agro_protocols,
    active,
    contract_id
  }))
}));

jest.mock('../src/Business/Models/token', () => {
  const mockToken = {
    token_id: '',
    token_name: '',
    emition_date: '',
    token_price_USD: 0,
    amount_tokens: 0,
    owner_id: '',
    production_id: '',
    unidad: jest.fn()
  };

  return {
    Token: jest.fn().mockImplementation(() => mockToken),
    CafeToken: jest.fn().mockImplementation(() => ({
      ...mockToken,
      unidad: () => 'cajuelas'
    })),
    PinaToken: jest.fn().mockImplementation(() => ({
      ...mockToken,
      unidad: () => 'kilos'
    })),
    BananoToken: jest.fn().mockImplementation(() => ({
      ...mockToken,
      unidad: () => 'racimos'
    })),
    TokenFactory: {
      create: jest.fn()
    }
  };
});

// Importar después de mockear
import { SmartContractService } from '../src/Business/Services/smartContractService';
import { ProductionService } from '../src/Business/Services/productionService';
import { TokenService } from '../src/Business/Services/tokenService';
import { MarketService } from '../src/Business/Services/marketService';
import { SmartContractRepositoryPostgres } from '../src/Persistence/Repos/smartContractRepository';
import { ProductionRepositoryPostgres } from '../src/Persistence/Repos/productionRepository';
import { TokenRepositoryPostgres } from '../src/Persistence/Repos/tokenRepository';
import { MarketRepositoryPostgres } from '../src/Persistence/Repos/marketRepository';
import { SmartContract } from '../src/Business/Models/smart_contract';
import { Production } from '../src/Business/Models/production';
import { Token, TokenFactory } from '../src/Business/Models/token';

const app = express();
app.use(express.json());
app.use('/api/token', productionRouter);

describe('POST /api/token/tokenizeAsset', () => {
  let mockSmartContractService: any;
  let mockProductionService: any;
  let mockTokenService: any;
  let mockMarketService: any;
  let mockSmartContractRepo: any;
  let mockProductionRepo: any;
  let mockTokenRepo: any;
  let mockMarketRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockSmartContractService = new SmartContractService();
    mockProductionService = new ProductionService();
    mockTokenService = new TokenService();
    mockMarketService = new MarketService();
    mockSmartContractRepo = new SmartContractRepositoryPostgres();
    mockProductionRepo = new ProductionRepositoryPostgres();
    mockTokenRepo = new TokenRepositoryPostgres();
    mockMarketRepo = new MarketRepositoryPostgres();
  });

  it('should successfully tokenize production asset with all data', async () => {
    // Arrange
    const tokenizeRequest = {
      smart_contract_data: {
        contract_id: 'contract-123',
        contract_address: '0x742d35Cc6634C0532925a3b8Doe456f7eF20d6',
        standard_implemented: 'ERC-1155',
        initial_token_price: 10.5,
        total_tokens: 1000,
        emition_date: '2023-01-01',
        active: true,
        contract_state: 'deployed'
      },
      production_data: {
        location: 'Farm Location 1',
        farmer_id: 'farmer-123',
        crop_type: 'Coffee',
        crop_variety: 'Arabica',
        est_harvest_date: '2023-06-01',
        amount: 5000,
        measure_unit: 'kg',
        biologic_features: 'Organic, Shade-grown',
        agro_conditions: 'High altitude, Volcanic soil',
        agro_protocols: 'Sustainable farming, No pesticides',
        active: true
      },
      token_data: {
        type: 'cafe' as const,
        token_id: 'token-123',
        token_name: 'Premium Coffee Tokens',
        emition_date: '2023-01-01',
        token_price_USD: 10.5,
        amount_tokens: 1000,
        on_market: true,
        owner_id: 'farmer-123'
      }
    };

    // Mock responses
    mockSmartContractService.addSmartContract.mockResolvedValue('contract-123');
    mockProductionService.addProduction.mockResolvedValue('production-456');
    mockTokenService.createTokens.mockResolvedValue('token-789');
    mockMarketService.publishOnMarket.mockResolvedValue();

    // Mock TokenFactory
    const mockTokenInstance = {
      token_id: 'token-123',
      token_name: 'Premium Coffee Tokens',
      emition_date: '2023-01-01',
      token_price_USD: 10.5,
      amount_tokens: 1000,
      owner_id: 'farmer-123',
      production_id: 'production-456',
      unidad: () => 'cajuelas'
    };
    (TokenFactory.create as jest.Mock).mockReturnValue(mockTokenInstance);

    // Act
    const response = await request(app)
      .post('/api/token/tokenizeAsset')
      .send(tokenizeRequest)
      .set('Accept', 'application/json');

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Producción tokenizada con éxito',
      contractId: 'contract-123',
      tokenId: 'token-789'
    });

    // Verify SmartContract creation
    expect(SmartContract).toHaveBeenCalledWith(
      'contract-123',
      '0x742d35Cc6634C0532925a3b8Doe456f7eF20d6',
      'ERC-1155',
      10.5,
      1000,
      '2023-01-01',
      true,
      'deployed'
    );
    expect(mockSmartContractService.addSmartContract).toHaveBeenCalledWith(expect.any(Object));

    // Verify Production creation
    expect(Production).toHaveBeenCalledWith(
      'Farm Location 1',
      'farmer-123',
      'Coffee',
      'Arabica',
      '2023-06-01',
      5000,
      'kg',
      'Organic, Shade-grown',
      'High altitude, Volcanic soil',
      'Sustainable farming, No pesticides',
      true,
      'contract-123'
    );
    expect(mockProductionService.addProduction).toHaveBeenCalledWith(expect.any(Object));

    // Verify Token creation
    expect(TokenFactory.create).toHaveBeenCalledWith(
      'cafe',
      'token-123',
      'Premium Coffee Tokens',
      '2023-01-01',
      10.5,
      1000,
      'farmer-123',
      'production-456'
    );
    expect(mockTokenService.createTokens).toHaveBeenCalledWith(mockTokenInstance);

    // Verify Market publication
    expect(mockSmartContractService.publishOnMarket).toHaveBeenCalledWith(mockTokenInstance);
  });

  it('should handle tokenization for different token types', async () => {
    // Arrange
    const tokenizeRequest = {
      smart_contract_data: {
        contract_id: 'contract-456',
        contract_address: '0x842d35Cc6634C0532925a3b8Doe456f7eF20d7',
        standard_implemented: 'ERC-1155',
        initial_token_price: 8.2,
        total_tokens: 800,
        emition_date: '2023-02-01',
        active: true,
        contract_state: 'deployed'
      },
      production_data: {
        location: 'Farm Location 2',
        farmer_id: 'farmer-456',
        crop_type: 'Pineapple',
        crop_variety: 'MD2',
        est_harvest_date: '2023-07-15',
        amount: 3000,
        measure_unit: 'kg',
        biologic_features: 'Golden variety, Sweet',
        agro_conditions: 'Tropical climate, Well-drained soil',
        agro_protocols: 'Integrated pest management',
        active: true
      },
      token_data: {
        type: 'pina' as const,
        token_id: 'token-456',
        token_name: 'Golden Pineapple Tokens',
        emition_date: '2023-02-01',
        token_price_USD: 8.2,
        amount_tokens: 800,
        on_market: true,
        owner_id: 'farmer-456'
      }
    };

    mockSmartContractService.addSmartContract.mockResolvedValue('contract-456');
    mockProductionService.addProduction.mockResolvedValue('production-789');
    mockTokenService.createTokens.mockResolvedValue('token-999');

    const mockTokenInstance = {
      token_id: 'token-456',
      token_name: 'Golden Pineapple Tokens',
      emition_date: '2023-02-01',
      token_price_USD: 8.2,
      amount_tokens: 800,
      owner_id: 'farmer-456',
      production_id: 'production-789',
      unidad: () => 'kilos'
    };
    (TokenFactory.create as jest.Mock).mockReturnValue(mockTokenInstance);

    // Act
    const response = await request(app)
      .post('/api/token/tokenizeAsset')
      .send(tokenizeRequest)
      .set('Accept', 'application/json');

    // Assert
    expect(response.status).toBe(201);
    expect(TokenFactory.create).toHaveBeenCalledWith(
      'pina',
      'token-456',
      'Golden Pineapple Tokens',
      '2023-02-01',
      8.2,
      800,
      'farmer-456',
      'production-789'
    );
  });

  it('should handle error in smart contract creation', async () => {
    // Arrange
    const tokenizeRequest = {
      smart_contract_data: {
        contract_id: 'contract-err',
        contract_address: '0x942d35Cc6634C0532925a3b8Doe456f7eF20d8',
        standard_implemented: 'ERC-1155',
        initial_token_price: 12.0,
        total_tokens: 500,
        emition_date: '2023-03-01',
        active: true,
        contract_state: 'deployed'
      },
      production_data: {
        location: 'Farm Location 3',
        farmer_id: 'farmer-789',
        crop_type: 'Banana',
        crop_variety: 'Cavendish',
        est_harvest_date: '2023-08-01',
        amount: 4000,
        measure_unit: 'kg',
        biologic_features: 'Conventional, Export quality',
        agro_conditions: 'Humid tropical climate',
        agro_protocols: 'Standard banana protocols',
        active: true
      },
      token_data: {
        type: 'banano' as const,
        token_id: 'token-err',
        token_name: 'Banana Export Tokens',
        emition_date: '2023-03-01',
        token_price_USD: 12.0,
        amount_tokens: 500,
        on_market: true,
        owner_id: 'farmer-789'
      }
    };

    mockSmartContractService.addSmartContract.mockRejectedValue(new Error('Smart contract creation failed'));

    // Act
    const response = await request(app)
      .post('/api/token/tokenizeAsset')
      .send(tokenizeRequest)
      .set('Accept', 'application/json');

    // Assert
    expect(response.status).toBe(500);
    expect(mockProductionService.addProduction).not.toHaveBeenCalled();
    expect(mockTokenService.createTokens).not.toHaveBeenCalled();
    expect(mockSmartContractService.publishOnMarket).not.toHaveBeenCalled();
  });

  it('should handle error in production creation', async () => {
    // Arrange
    const tokenizeRequest = {
      smart_contract_data: {
        contract_id: 'contract-789',
        contract_address: '0xa42d35Cc6634C0532925a3b8Doe456f7eF20d9',
        standard_implemented: 'ERC-1155',
        initial_token_price: 15.0,
        total_tokens: 1200,
        emition_date: '2023-04-01',
        active: true,
        contract_state: 'deployed'
      },
      production_data: {
        location: 'Farm Location 4',
        farmer_id: 'farmer-999',
        crop_type: 'Coffee',
        crop_variety: 'Robusta',
        est_harvest_date: '2023-09-01',
        amount: 6000,
        measure_unit: 'kg',
        biologic_features: 'Conventional, High yield',
        agro_conditions: 'Low altitude, Clay soil',
        agro_protocols: 'Standard farming practices',
        active: true
      },
      token_data: {
        type: 'cafe' as const,
        token_id: 'token-111',
        token_name: 'Robusta Coffee Tokens',
        emition_date: '2023-04-01',
        token_price_USD: 15.0,
        amount_tokens: 1200,
        on_market: true,
        owner_id: 'farmer-999'
      }
    };

    mockSmartContractService.addSmartContract.mockResolvedValue('contract-789');
    mockProductionService.addProduction.mockRejectedValue(new Error('Production creation failed'));

    // Act
    const response = await request(app)
      .post('/api/token/tokenizeAsset')
      .send(tokenizeRequest)
      .set('Accept', 'application/json');

    // Assert
    expect(response.status).toBe(500);
    expect(mockTokenService.createTokens).not.toHaveBeenCalled();
    expect(mockSmartContractService.publishOnMarket).not.toHaveBeenCalled();
  });

  it('should handle error in token creation', async () => {
    // Arrange
    const tokenizeRequest = {
      smart_contract_data: {
        contract_id: 'contract-222',
        contract_address: '0xb42d35Cc6634C0532925a3b8Doe456f7eF21d0',
        standard_implemented: 'ERC-1155',
        initial_token_price: 20.0,
        total_tokens: 1500,
        emition_date: '2023-05-01',
        active: true,
        contract_state: 'deployed'
      },
      production_data: {
        location: 'Farm Location 5',
        farmer_id: 'farmer-222',
        crop_type: 'Pineapple',
        crop_variety: 'Queen',
        est_harvest_date: '2023-10-01',
        amount: 2500,
        measure_unit: 'kg',
        biologic_features: 'Traditional variety, Aromatic',
        agro_conditions: 'Subtropical climate',
        agro_protocols: 'Organic farming',
        active: true
      },
      token_data: {
        type: 'pina' as const,
        token_id: 'token-222',
        token_name: 'Queen Pineapple Tokens',
        emition_date: '2023-05-01',
        token_price_USD: 20.0,
        amount_tokens: 1500,
        on_market: true,
        owner_id: 'farmer-222'
      }
    };

    mockSmartContractService.addSmartContract.mockResolvedValue('contract-222');
    mockProductionService.addProduction.mockResolvedValue('production-222');
    mockTokenService.createTokens.mockRejectedValue(new Error('Token creation failed'));

    const mockTokenInstance = {
      token_id: 'token-222',
      token_name: 'Queen Pineapple Tokens',
      emition_date: '2023-05-01',
      token_price_USD: 20.0,
      amount_tokens: 1500,
      owner_id: 'farmer-222',
      production_id: 'production-222',
      unidad: () => 'kilos'
    };
    (TokenFactory.create as jest.Mock).mockReturnValue(mockTokenInstance);

    // Act
    const response = await request(app)
      .post('/api/token/tokenizeAsset')
      .send(tokenizeRequest)
      .set('Accept', 'application/json');

    // Assert
    expect(response.status).toBe(500);
    expect(mockSmartContractService.publishOnMarket).not.toHaveBeenCalled();
  });

  it('should handle error in market publication (non-blocking)', async () => {
    // Arrange
    const tokenizeRequest = {
      smart_contract_data: {
        contract_id: 'contract-333',
        contract_address: '0xc42d35Cc6634C0532925a3b8Doe456f7eF21d1',
        standard_implemented: 'ERC-1155',
        initial_token_price: 18.5,
        total_tokens: 900,
        emition_date: '2023-06-01',
        active: true,
        contract_state: 'deployed'
      },
      production_data: {
        location: 'Farm Location 6',
        farmer_id: 'farmer-333',
        crop_type: 'Banana',
        crop_variety: 'Red Banana',
        est_harvest_date: '2023-11-01',
        amount: 3500,
        measure_unit: 'kg',
        biologic_features: 'Specialty variety, Red skin',
        agro_conditions: 'Warm climate, Rich soil',
        agro_protocols: 'Sustainable practices',
        active: true
      },
      token_data: {
        type: 'banano' as const,
        token_id: 'token-333',
        token_name: 'Red Banana Tokens',
        emition_date: '2023-06-01',
        token_price_USD: 18.5,
        amount_tokens: 900,
        on_market: true,
        owner_id: 'farmer-333'
      }
    };

    mockSmartContractService.addSmartContract.mockResolvedValue('contract-333');
    mockProductionService.addProduction.mockResolvedValue('production-333');
    mockTokenService.createTokens.mockResolvedValue('token-333');
    mockSmartContractService.publishOnMarket.mockRejectedValue(new Error('Market publication failed'));

    const mockTokenInstance = {
      token_id: 'token-333',
      token_name: 'Red Banana Tokens',
      emition_date: '2023-06-01',
      token_price_USD: 18.5,
      amount_tokens: 900,
      owner_id: 'farmer-333',
      production_id: 'production-333',
      unidad: () => 'racimos'
    };
    (TokenFactory.create as jest.Mock).mockReturnValue(mockTokenInstance);

    // Act
    const response = await request(app)
      .post('/api/token/tokenizeAsset')
      .send(tokenizeRequest)
      .set('Accept', 'application/json');

    // Assert - Market publication error should not affect the main response
    // since it's called without await (fire and forget)
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Producción tokenizada con éxito',
      contractId: 'contract-333',
      tokenId: 'token-333'
    });
    expect(mockSmartContractService.publishOnMarket).toHaveBeenCalledWith(mockTokenInstance);
  });

  it('should return 400 for invalid request body', async () => {
    // Arrange - missing required fields
    const invalidRequest = {
      smart_contract_data: {
        // missing required fields
      },
      production_data: {
        // missing required fields
      },
      token_data: {
        // missing required fields
      }
    };

    // Act
    const response = await request(app)
      .post('/api/token/tokenizeAsset')
      .send(invalidRequest)
      .set('Accept', 'application/json');

    // Assert
    expect(response.status).toBe(400);
  });

  it('should handle production without contract_id', async () => {
    // Arrange
    const tokenizeRequest = {
      smart_contract_data: {
        contract_id: 'contract-444',
        contract_address: '0xd42d35Cc6634C0532925a3b8Doe456f7eF21d2',
        standard_implemented: 'ERC-1155',
        initial_token_price: 11.0,
        total_tokens: 700,
        emition_date: '2023-07-01',
        active: true,
        contract_state: 'deployed'
      },
      production_data: {
        location: 'Farm Location 7',
        farmer_id: 'farmer-444',
        crop_type: 'Coffee',
        crop_variety: 'Liberica',
        est_harvest_date: '2023-12-01',
        amount: 4500,
        measure_unit: 'kg',
        biologic_features: 'Rare variety, Unique flavor',
        agro_conditions: 'Specific microclimate',
        agro_protocols: 'Traditional methods',
        active: true
        // contract_id will be provided by the service
      },
      token_data: {
        type: 'cafe' as const,
        token_id: 'token-444',
        token_name: 'Liberica Coffee Tokens',
        emition_date: '2023-07-01',
        token_price_USD: 11.0,
        amount_tokens: 700,
        on_market: true,
        owner_id: 'farmer-444'
      }
    };

    mockSmartContractService.addSmartContract.mockResolvedValue('contract-444');
    mockProductionService.addProduction.mockResolvedValue('production-444');
    mockTokenService.createTokens.mockResolvedValue('token-444');

    const mockTokenInstance = {
      token_id: 'token-444',
      token_name: 'Liberica Coffee Tokens',
      emition_date: '2023-07-01',
      token_price_USD: 11.0,
      amount_tokens: 700,
      owner_id: 'farmer-444',
      production_id: 'production-444',
      unidad: () => 'cajuelas'
    };
    (TokenFactory.create as jest.Mock).mockReturnValue(mockTokenInstance);

    // Act
    const response = await request(app)
      .post('/api/token/tokenizeAsset')
      .send(tokenizeRequest)
      .set('Accept', 'application/json');

    // Assert
    expect(response.status).toBe(201);
    // Verify that Production was created with the contract_id from smart contract
    expect(Production).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.any(Number),
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.any(Boolean),
      'contract-444' // This should come from the smart contract creation
    );
  });

  it('should handle unknown token type', async () => {
    // Arrange
    const tokenizeRequest = {
      smart_contract_data: {
        contract_id: 'contract-555',
        contract_address: '0xe42d35Cc6634C0532925a3b8Doe456f7eF21d3',
        standard_implemented: 'ERC-1155',
        initial_token_price: 25.0,
        total_tokens: 600,
        emition_date: '2023-08-01',
        active: true,
        contract_state: 'deployed'
      },
      production_data: {
        location: 'Farm Location 8',
        farmer_id: 'farmer-555',
        crop_type: 'Cocoa',
        crop_variety: 'Criollo',
        est_harvest_date: '2024-01-01',
        amount: 2000,
        measure_unit: 'kg',
        biologic_features: 'Fine flavor cocoa',
        agro_conditions: 'Rainforest understory',
        agro_protocols: 'Agroforestry system',
        active: true
      },
      token_data: {
        type: 'cocoa' as any, // Unknown token type
        token_id: 'token-555',
        token_name: 'Criollo Cocoa Tokens',
        emition_date: '2023-08-01',
        token_price_USD: 25.0,
        amount_tokens: 600,
        on_market: true,
        owner_id: 'farmer-555'
      }
    };

    mockSmartContractService.addSmartContract.mockResolvedValue('contract-555');
    mockProductionService.addProduction.mockResolvedValue('production-555');

    // Mock TokenFactory to throw error for unknown type
    (TokenFactory.create as jest.Mock).mockImplementation(() => {
      throw new Error('Tipo de token desconocido: cocoa');
    });

    // Act
    const response = await request(app)
      .post('/api/token/tokenizeAsset')
      .send(tokenizeRequest)
      .set('Accept', 'application/json');

    // Assert
    expect(response.status).toBe(500);
    expect(mockTokenService.createTokens).not.toHaveBeenCalled();
    expect(mockSmartContractService.publishOnMarket).not.toHaveBeenCalled();
  });
});