﻿using Application.Layers.Persistence;
using Application.Layers.Persistence.Repository;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repository;

public class TerminalSettingRepository: ITerminalSettingRepository  
{
    private readonly IPersistenceContext _persistenceContext;

    public TerminalSettingRepository(IPersistenceContext persistenceContext)
    {
        _persistenceContext = persistenceContext;
    }

    public async Task<TerminalSetting> GetTerminalSettingByUser(long userId)
    {
        var terminalSetting = await _persistenceContext.TerminalSettings
            .FirstOrDefaultAsync(p=> p.UserId == userId);

        if (terminalSetting is null)
        {
            throw new NotFoundException($"Настройка терминала с указанным 'UserId' ${userId} не найден", "UserId");
        }

        return terminalSetting;
    }

    public async Task<TerminalSetting> AddTerminalSetting(TerminalSetting terminalSetting)
    {
        await _persistenceContext.TerminalSettings.AddAsync(terminalSetting);
        await _persistenceContext.SaveChangesAsync();

        return terminalSetting;
    }

    public async Task<TerminalSetting> UpdateTerminalSetting(TerminalSetting terminalSetting)
    {
        var existingEntity = _persistenceContext.TerminalSettings.Local
            .FirstOrDefault(e => e.Id == terminalSetting.Id);

        if (existingEntity != null)
        {
            _persistenceContext.Entry(existingEntity).State = EntityState.Detached;
        }
        
        _persistenceContext.Attach(terminalSetting);
        
        _persistenceContext.TerminalSettings.Update(terminalSetting);

        await _persistenceContext.SaveChangesAsync();

        return terminalSetting;
    }
}